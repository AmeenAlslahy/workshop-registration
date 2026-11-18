import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from apps.participants.models import Participant
from config.localization import api_message
from .models import Workshop, Registration
from .serializers import (
    WorkshopSerializer,
    RegisterActionSerializer,
    CancelActionSerializer,
    ParticipantIdQuerySerializer,
)
from .services import register_participant, cancel_registration
from .exceptions import WorkshopFullError, AlreadyRegisteredError, AlreadyCancelledError

logger = logging.getLogger(__name__)


class WorkshopListView(APIView):
    def get(self, request):
        query_serializer = ParticipantIdQuerySerializer(data=request.query_params)
        if not query_serializer.is_valid():
            return Response(query_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        participant_id = query_serializer.validated_data['participant_id']

        if not Participant.objects.filter(pk=participant_id).exists():
            return Response(
                {"error": api_message(request, 'error.participant_not_found')},
                status=status.HTTP_404_NOT_FOUND
            )

        # تحسين الأداء: جلب التسجيلات مسبقًا
        registrations_qs = Registration.objects.filter(
            participant_id=participant_id
        ).order_by('-created_at')

        workshops = Workshop.objects.prefetch_related(
            Prefetch('registrations', queryset=registrations_qs, to_attr='participant_registrations')
        ).all()

        serializer = WorkshopSerializer(workshops, many=True)
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request, workshop_id):
        serializer = RegisterActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        participant_id = serializer.validated_data['participant_id']

        if not Participant.objects.filter(pk=participant_id).exists():
            return Response(
                {"error": api_message(request, 'error.participant_not_found')},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            registration = register_participant(participant_id, workshop_id)
        except Workshop.DoesNotExist:
            return Response(
                {"error": api_message(request, 'error.workshop_not_found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except (AlreadyRegisteredError, WorkshopFullError) as exc:
            # 409 Conflict: الطلب يتعارض مع الحالة الحالية للمورد
            return Response(
                {"error": api_message(request, exc.code)},
                status=status.HTTP_409_CONFLICT
            )
        except Exception:
            # أي خطأ آخر (مثل DataInconsistencyError) يُعتبر خطأ في الخادم
            logger.exception(
                'Unexpected error while registering participant %s for workshop %s',
                participant_id,
                workshop_id,
            )
            return Response(
                {"error": api_message(request, 'error.internal')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "message": api_message(request, 'success.registration'),
                "registration_id": registration.id,
            },
            status=status.HTTP_201_CREATED
        )


class CancelView(APIView):
    def post(self, request, registration_id):
        serializer = CancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        participant_id = serializer.validated_data['participant_id']

        try:
            cancel_registration(participant_id, registration_id)
        except Registration.DoesNotExist:
            return Response(
                {"error": api_message(request, 'error.registration_not_found')},
                status=status.HTTP_404_NOT_FOUND
            )
        except AlreadyCancelledError as exc:
            return Response(
                {"error": api_message(request, exc.code)},
                status=status.HTTP_409_CONFLICT
            )
        except Exception:
            logger.exception(
                'Unexpected error while cancelling registration %s for participant %s',
                registration_id,
                participant_id,
            )
            return Response(
                {"error": api_message(request, 'error.internal')},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": api_message(request, 'success.cancellation')},
            status=status.HTTP_200_OK
        )
