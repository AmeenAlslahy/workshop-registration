"""Localized API messages.

Every user-facing API message lives in this catalog instead of being written
inline in views or services. The response language is resolved per request from
the ``Accept-Language`` header, so the same endpoint answers in English or
Arabic without changing its logic. English is both the default and the fallback.
"""

from django.conf import settings
from django.http import HttpRequest
from django.utils.translation import get_language_from_request

DEFAULT_LANGUAGE = 'en'

# Derived from settings.LANGUAGES so the catalog and Django cannot disagree.
SUPPORTED_LANGUAGES = tuple(
    code.split('-')[0].lower() for code, _ in settings.LANGUAGES
)

MESSAGES = {
    'success.registration': {
        'en': 'Registration successful',
        'ar': 'تم التسجيل بنجاح',
    },
    'success.cancellation': {
        'en': 'Registration cancelled',
        'ar': 'تم إلغاء التسجيل',
    },
    'error.participant_not_found': {
        'en': 'Participant not found.',
        'ar': 'لم يتم العثور على المشارك.',
    },
    'error.workshop_not_found': {
        'en': 'Workshop not found.',
        'ar': 'لم يتم العثور على الورشة.',
    },
    'error.registration_not_found': {
        'en': 'Registration not found.',
        'ar': 'لم يتم العثور على التسجيل.',
    },
    'error.workshop_full': {
        'en': 'Workshop is full.',
        'ar': 'الورشة ممتلئة.',
    },
    'error.already_registered': {
        'en': 'Participant already has an active registration.',
        'ar': 'لدى المشارك تسجيل نشط في هذه الورشة بالفعل.',
    },
    'error.already_cancelled': {
        'en': 'Registration is already cancelled.',
        'ar': 'التسجيل ملغى بالفعل.',
    },
    'error.internal': {
        'en': 'Internal server error.',
        'ar': 'حدث خطأ داخلي في الخادم.',
    },
}


def resolve_language(request: HttpRequest) -> str:
    """Return the supported language Django negotiated for this request."""
    language = get_language_from_request(request, check_path=False)
    primary = (language or '').split('-')[0].lower()

    if primary in SUPPORTED_LANGUAGES:
        return primary

    return DEFAULT_LANGUAGE


def api_message(request: HttpRequest, key: str) -> str:
    """Translate ``key`` into the request language, falling back to English."""
    translations = MESSAGES[key]
    return translations.get(resolve_language(request), translations[DEFAULT_LANGUAGE])
