import type { Locale } from './types'

export const en = {
  'app.title': 'Workshop Studio — Seat reservations',
  'brand.name': 'Workshop Studio',
  'brand.tagline': 'Training center',
  'header.note': 'Seat reservations · Live capacity',
  'header.switchToEnglish': 'English',
  'header.switchToArabic': 'العربية',
  'header.themeToDark': 'Switch to dark mode',
  'header.themeToLight': 'Switch to light mode',

  'hero.eyebrow': 'Workshop registration',
  'hero.titleLine1': 'Find your seat.',
  'hero.titleLine2': 'Make room to learn.',
  'hero.lede':
    "Browse the training center's workshops, see live seat availability, and manage one participant's registrations without leaving the page.",
  'hero.metaLive': 'Availability updates after every action',
  'hero.metaHistory': 'Cancelled registrations stay in the history',

  'summary.title': 'Workshop availability summary',
  'summary.live': 'Live capacity',
  'summary.openWorkshops': 'Open workshops',
  'summary.seatsAvailable': 'Seats available',
  'summary.ofTotal': 'of {total} total',
  'summary.filled': '{percent} of all seats filled',

  'participant.viewingAs': 'Viewing as',
  'participant.hint': 'Registrations below belong to this participant.',
  'participant.busyHint':
    'Wait for the current action to finish before switching participants.',
  'participant.choose': 'Choose a participant',

  'workshops.title': 'Workshops',
  'workshops.meta': '{count} sessions · {open} open',
  'workshops.refreshing': 'Refreshing availability…',
  'workshops.refreshErrorTitle': 'Could not refresh availability',

  'card.status.registered': 'Registered',
  'card.status.full': 'Full',
  'card.status.cancelled': 'Cancelled previously',
  'card.status.available': 'Open',
  'card.action.register': 'Register',
  'card.action.registerAgain': 'Register again',
  'card.action.cancel': 'Cancel registration',
  'card.action.full': 'Workshop full',
  'card.pending.reserve': 'Reserving seat…',
  'card.pending.reserveAgain': 'Registering again…',
  'card.pending.cancel': 'Cancelling…',
  'card.history.registered': 'Registered {date}',
  'card.history.cancelled': 'Cancelled {date}',
  'card.noRegistration': 'No registration on file',
  'card.seatsAvailable.one': '{available} of {capacity} seat available',
  'card.seatsAvailable.other': '{available} of {capacity} seats available',
  'card.seatsTotal.one': '{capacity} seat total',
  'card.seatsTotal.other': '{capacity} seats total',
  'card.percentFilled': '{percent} filled',
  'card.descriptionFallback':
    'The training center will share the session details soon.',

  'page.retry': 'Try again',
  'page.participantsErrorTitle': "We couldn't load participants",
  'page.participantsEmptyTitle': 'No participants are seeded',
  'page.participantsEmptyBody':
    'Run "python manage.py seed_data" in the Django project, then refresh this page.',
  'page.participantsEmptyAction': 'Refresh participants',
  'page.participantsStaleTitle': 'Participant list may be stale',
  'page.workshopsErrorTitle': "We couldn't load workshops",
  'page.workshopsEmptyTitle': 'No workshops available',
  'page.workshopsEmptyBody':
    'The training center has not published any workshops yet. Seed the database and refresh.',
  'page.workshopsEmptyAction': 'Refresh workshops',

  'notice.dismiss': 'Dismiss message',
  'a11y.loadingPage': 'Loading page',
  'a11y.loadingWorkshops': 'Loading workshops',
  'a11y.loadingWorkshopsText': 'Loading workshops…',

  'error.boundaryTitle': 'Something went wrong',
  'error.boundaryBody':
    'The interface hit an unexpected error. Reloading usually fixes it. Your registrations are stored on the server.',
  'error.boundaryAction': 'Reload application',
  'error.network':
    'Cannot reach the workshop service. Make sure the Django server is running.',
  'error.timeout': 'The request took too long. Please try again.',
  'error.invalidResponse': 'The server returned an unexpected response.',
  'error.unexpected': 'Something went wrong. Please try again.',

  'footer.serverTruth':
    'Capacity is confirmed by the server after every action.',
  'footer.stack': 'Django REST Framework · React',
} as const

export type MessageKey = keyof typeof en

export const ar: Record<MessageKey, string> = {
  'app.title': 'استوديو الورش — حجز المقاعد',
  'brand.name': 'استوديو الورش',
  'brand.tagline': 'مركز التدريب',
  'header.note': 'حجز المقاعد · سعة مباشرة',
  'header.switchToEnglish': 'English',
  'header.switchToArabic': 'العربية',
  'header.themeToDark': 'التبديل إلى الوضع الداكن',
  'header.themeToLight': 'التبديل إلى الوضع الفاتح',

  'hero.eyebrow': 'تسجيل الورش',
  'hero.titleLine1': 'احجز مقعدك.',
  'hero.titleLine2': 'واترك مساحة للتعلّم.',
  'hero.lede':
    'تصفّح ورش مركز التدريب، واطّلع على السعة المباشرة، وأدر تسجيلات مشارك واحد دون مغادرة الصفحة.',
  'hero.metaLive': 'تتحدث السعة بعد كل إجراء',
  'hero.metaHistory': 'تبقى التسجيلات الملغاة في السجل',

  'summary.title': 'ملخص توفر الورش',
  'summary.live': 'السعة الآن',
  'summary.openWorkshops': 'ورش مفتوحة',
  'summary.seatsAvailable': 'مقاعد متاحة',
  'summary.ofTotal': 'من أصل {total}',
  'summary.filled': '{percent} من إجمالي المقاعد مشغولة',

  'participant.viewingAs': 'تسجّل بصفة',
  'participant.hint': 'التسجيلات أدناه تخص هذا المشارك.',
  'participant.busyHint': 'انتظر انتهاء الإجراء الحالي قبل تبديل المشارك.',
  'participant.choose': 'اختر مشاركًا',

  'workshops.title': 'الورش',
  'workshops.meta': 'الجلسات: {count} · المفتوحة: {open}',
  'workshops.refreshing': 'جارٍ تحديث السعة…',
  'workshops.refreshErrorTitle': 'تعذر تحديث السعة',

  'card.status.registered': 'مسجّل',
  'card.status.full': 'ممتلئة',
  'card.status.cancelled': 'أُلغي سابقًا',
  'card.status.available': 'متاحة',
  'card.action.register': 'تسجيل',
  'card.action.registerAgain': 'إعادة التسجيل',
  'card.action.cancel': 'إلغاء التسجيل',
  'card.action.full': 'الورشة ممتلئة',
  'card.pending.reserve': 'جارٍ حجز المقعد…',
  'card.pending.reserveAgain': 'جارٍ إعادة التسجيل…',
  'card.pending.cancel': 'جارٍ الإلغاء…',
  'card.history.registered': 'سُجّل في {date}',
  'card.history.cancelled': 'أُلغي في {date}',
  'card.noRegistration': 'لا يوجد تسجيل مسجّل',
  'card.seatsAvailable.one': 'المقاعد المتاحة: {available} من {capacity}',
  'card.seatsAvailable.other': 'المقاعد المتاحة: {available} من {capacity}',
  'card.seatsTotal.one': 'إجمالي المقاعد: {capacity}',
  'card.seatsTotal.other': 'إجمالي المقاعد: {capacity}',
  'card.percentFilled': 'الإشغال {percent}',
  'card.descriptionFallback': 'سيشارك مركز التدريب تفاصيل الجلسة قريبًا.',

  'page.retry': 'إعادة المحاولة',
  'page.participantsErrorTitle': 'تعذر تحميل المشاركين',
  'page.participantsEmptyTitle': 'لا يوجد مشاركون في قاعدة البيانات',
  'page.participantsEmptyBody':
    'شغّل الأمر "python manage.py seed_data" في مشروع Django ثم حدّث الصفحة.',
  'page.participantsEmptyAction': 'تحديث المشاركين',
  'page.participantsStaleTitle': 'قد تكون قائمة المشاركين قديمة',
  'page.workshopsErrorTitle': 'تعذر تحميل الورش',
  'page.workshopsEmptyTitle': 'لا توجد ورش متاحة',
  'page.workshopsEmptyBody':
    'لم ينشر مركز التدريب أي ورش بعد. أضف البيانات التجريبية ثم حدّث الصفحة.',
  'page.workshopsEmptyAction': 'تحديث الورش',

  'notice.dismiss': 'إغلاق الرسالة',
  'a11y.loadingPage': 'جارٍ تحميل الصفحة',
  'a11y.loadingWorkshops': 'جارٍ تحميل الورش',
  'a11y.loadingWorkshopsText': 'جارٍ تحميل الورش…',

  'error.boundaryTitle': 'حدث خطأ غير متوقع',
  'error.boundaryBody':
    'واجهت الواجهة خطأ غير متوقع. إعادة التحميل تحل المشكلة عادةً. تسجيلاتك محفوظة على الخادم.',
  'error.boundaryAction': 'إعادة تحميل التطبيق',
  'error.network':
    'تعذر الوصول إلى خدمة الورش. تأكد من تشغيل خادم Django.',
  'error.timeout': 'استغرق الطلب وقتًا طويلًا. حاول مرة أخرى.',
  'error.invalidResponse': 'أعاد الخادم استجابة غير متوقعة.',
  'error.unexpected': 'حدث خطأ ما. حاول مرة أخرى.',

  'footer.serverTruth': 'تُؤكَّد السعة من الخادم بعد كل إجراء.',
  'footer.stack': 'Django REST Framework · React',
}

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en,
  ar,
}
