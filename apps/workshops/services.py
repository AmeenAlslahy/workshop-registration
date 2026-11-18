from django.db import transaction, IntegrityError
from django.db.models import F
from django.utils import timezone
from .models import Workshop, Registration
from .exceptions import (
    WorkshopFullError,
    AlreadyRegisteredError,
    AlreadyCancelledError,
    DataInconsistencyError,
)


def register_participant(participant_id, workshop_id):
    with transaction.atomic():
        # 1. قفل الورشة أولاً (توحيد ترتيب الأقفال لمنع الـ Deadlock)
        # نستخدم select_for_update لضمان أننا نتعامل مع الورشة بشكل حصري
        workshop = Workshop.objects.select_for_update().get(id=workshop_id)

        # 2. فحص سريع (Fail-fast) قبل تحديث قاعدة البيانات
        # هذا لا يغني عن الفهرس الفريد، لكنه يوفر وقت المعالجة في الحالات العادية
        if Registration.objects.filter(
            participant_id=participant_id,
            workshop_id=workshop_id,
            status=Registration.Status.ACTIVE
        ).exists():
            raise AlreadyRegisteredError()

        # 3. التحقق من السعة وتحديثها
        if workshop.seats_taken >= workshop.capacity:
            raise WorkshopFullError()

        workshop.seats_taken = F('seats_taken') + 1
        workshop.save(update_fields=['seats_taken'])

        # 4. إنشاء التسجيل
        try:
            registration = Registration.objects.create(
                participant_id=participant_id,
                workshop_id=workshop_id,
                status=Registration.Status.ACTIVE
            )
        except IntegrityError as e:
            # التحقق من أن الخطأ هو بالتحديد انتهاك الفهرس الفريد وليس شيئًا آخر
            if 'unique_active_registration_per_workshop' in str(e):
                raise AlreadyRegisteredError()
            # إذا كان خطأ آخر (مثل participant_id غير موجود)، نتركه يمر
            raise

        return registration


def cancel_registration(participant_id, registration_id):
    with transaction.atomic():
        # 1. قراءة الورشة المرتبطة بدون قفل
        reg_info = Registration.objects.values('workshop_id').get(
            id=registration_id,
            participant_id=participant_id
        )

        # 2. قفل الورشة أولاً (توحيد ترتيب الأقفال مع دالة التسجيل)
        Workshop.objects.select_for_update().get(id=reg_info['workshop_id'])

        # 3. الآن نقفل التسجيل
        registration = Registration.objects.select_for_update().get(id=registration_id)

        # 4. فحص الحالة
        if registration.status == Registration.Status.CANCELLED:
            raise AlreadyCancelledError()

        # 5. إلغاء التسجيل
        registration.status = Registration.Status.CANCELLED
        registration.cancelled_at = timezone.now()
        registration.save(update_fields=['status', 'cancelled_at'])

        # 6. تحرير المقعد والتحقق من النتيجة
        updated_rows = Workshop.objects.filter(
            id=reg_info['workshop_id'],
            seats_taken__gt=0
        ).update(seats_taken=F('seats_taken') - 1)

        if updated_rows != 1:
            # هذا يعني أن seats_taken كان 0، لكن هناك تسجيل نشط! (فشل في اتساق البيانات)
            raise DataInconsistencyError()

        return registration
