from django.test import TestCase, TransactionTestCase
from unittest.mock import patch
from apps.participants.models import Participant
from apps.workshops.models import Workshop, Registration
from apps.workshops.services import register_participant, cancel_registration
from apps.workshops.exceptions import (
    WorkshopFullError, AlreadyRegisteredError, AlreadyCancelledError, DataInconsistencyError
)

class RegistrationServiceTests(TestCase):
    def setUp(self):
        # إعداد البيانات المشتركة لكل اختبار
        self.participant1 = Participant.objects.create(name="Ali", email="ali@test.com")
        self.participant2 = Participant.objects.create(name="Sara", email="sara@test.com")
        
        # ورشة عادية (سعة 2)
        self.workshop_normal = Workshop.objects.create(title="Python 101", capacity=2)
        # ورشة محدودة جداً (سعة 1) لاختبار الامتلاء
        self.workshop_tiny = Workshop.objects.create(title="Tiny Workshop", capacity=1)

    def test_duplicate_active_registration_rejected(self):
        """1. رفض التسجيل النشط المكرر."""
        # التسجيل الأول
        register_participant(self.participant1.id, self.workshop_normal.id)
        
        # المحاولة الثانية
        with self.assertRaises(AlreadyRegisteredError):
            register_participant(self.participant1.id, self.workshop_normal.id)
        
        # التأكد من أن السعة لم تتغير (لم يتم خصم مقعد إضافي)
        self.workshop_normal.refresh_from_db()
        self.assertEqual(self.workshop_normal.seats_taken, 1)
        
        # التأكد من وجود تسجيل واحد فقط
        self.assertEqual(Registration.objects.count(), 1)

    def test_register_again_after_cancellation_cycles(self):
        """2. إعادة التسجيل بعد الإلغاء، بما في ذلك الدورات المتكررة."""
        # دورة 1: تسجيل ثم إلغاء
        reg1 = register_participant(self.participant1.id, self.workshop_normal.id)
        cancel_registration(self.participant1.id, reg1.id)
        
        # دورة 2: تسجيل ثم إلغاء
        reg2 = register_participant(self.participant1.id, self.workshop_normal.id)
        cancel_registration(self.participant1.id, reg2.id)
        
        # دورة 3: تسجيل (نتركه نشطاً)
        reg3 = register_participant(self.participant1.id, self.workshop_normal.id)
        
        self.workshop_normal.refresh_from_db()
        self.assertEqual(self.workshop_normal.seats_taken, 1)
        
        # يجب أن يكون لدينا 3 سجلات (2 ملغيان، 1 نشط)
        self.assertEqual(Registration.objects.count(), 3)
        self.assertEqual(Registration.objects.filter(status='active').count(), 1)
        self.assertEqual(Registration.objects.filter(status='cancelled').count(), 2)

    def test_repeated_cancellation_no_extra_release(self):
        """3. الإلغاء المتكرر دون تحرير سعة إضافية."""
        reg = register_participant(self.participant1.id, self.workshop_normal.id)
        cancel_registration(self.participant1.id, reg.id)
        
        # محاولة إلغاء نفس التسجيل مرة أخرى
        with self.assertRaises(AlreadyCancelledError):
            cancel_registration(self.participant1.id, reg.id)
            
        # السعة يجب أن تبقى 0
        self.workshop_normal.refresh_from_db()
        self.assertEqual(self.workshop_normal.seats_taken, 0)

    def test_reject_registration_when_full(self):
        """4. رفض التسجيل عندما تكون الورشة ممتلئة."""
        # الورشة الصغيرة سعتها 1
        register_participant(self.participant1.id, self.workshop_tiny.id)
        
        # محاولة تسجيل مشارك آخر
        with self.assertRaises(WorkshopFullError):
            register_participant(self.participant2.id, self.workshop_tiny.id)
            
        self.workshop_tiny.refresh_from_db()
        self.assertEqual(self.workshop_tiny.seats_taken, 1)
        self.assertEqual(Registration.objects.count(), 1)

    def test_cancel_rollback_when_seat_accounting_is_inconsistent(self):
        """5. فشل الإلغاء يجب أن يعيد حالة التسجيل كما كانت."""
        registration = register_participant(
            self.participant1.id, self.workshop_normal.id
        )

        # Simulate corrupted capacity accounting: an active registration
        # exists while seats_taken says no seat is occupied.
        Workshop.objects.filter(pk=self.workshop_normal.pk).update(seats_taken=0)

        with self.assertRaises(DataInconsistencyError):
            cancel_registration(self.participant1.id, registration.id)

        registration.refresh_from_db()
        self.assertEqual(registration.status, Registration.Status.ACTIVE)
        self.assertIsNone(registration.cancelled_at)

        self.workshop_normal.refresh_from_db()
        self.assertEqual(self.workshop_normal.seats_taken, 0)


class RollbackTests(TransactionTestCase):
    """
    5. التراجع عن التغييرات عند فشل أحد أجزاء التسجيل.
    نستخدم TransactionTestCase لأننا نختبر Rollback حقيقي على مستوى قاعدة البيانات.
    """
    def setUp(self):
        self.participant = Participant.objects.create(name="Test", email="test@test.com")
        self.workshop = Workshop.objects.create(title="Rollback Test", capacity=5)

    def test_rollback_when_registration_creation_fails(self):
        # نقوم بعمل Mock لدالة الإنشاء لتُحدث خطأً متعمداً
        with patch('apps.workshops.services.Registration.objects.create') as mock_create:
            mock_create.side_effect = Exception("Simulated DB Failure")
            
            with self.assertRaises(Exception):
                register_participant(self.participant.id, self.workshop.id)
        
        # التحقق من أن السعة لم تتغير (تم التراجع عن الزيادة)
        self.workshop.refresh_from_db()
        self.assertEqual(self.workshop.seats_taken, 0)
        
        # التحقق من عدم وجود تسجيل
        self.assertEqual(Registration.objects.count(), 0)