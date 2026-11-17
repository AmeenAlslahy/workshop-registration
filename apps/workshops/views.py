from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from apps.participants.models import Participant
from .models import Workshop, Registration
from .serializers import (
    WorkshopSerializer,
    RegisterActionSerializer,
    CancelActionSerializer,
    ParticipantIdQuerySerializer,
)
from .services import register_participant, cancel_registration
from .exceptions import (
    WorkshopFullError, AlreadyRegisteredError, AlreadyCancelledError, DataInconsistencyError
)

class WorkshopListView(APIView):
    def get(self, request):
        query_serializer = ParticipantIdQuerySerializer(data=request.query_params)
        if not query_serializer.is_valid():
            return Response(query_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        participant_id = query_serializer.validated_data['participant_id']

        if not Participant.objects.filter(pk=participant_id).exists():
            return Response(
                {"error": "Participant not found."},
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
                {"error": "Participant not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            registration = register_participant(participant_id, workshop_id)
            return Response(
                {"message": "Registration successful", "registration_id": registration.id},
                status=status.HTTP_201_CREATED
            )
        except Workshop.DoesNotExist:
            return Response({"error": "Workshop not found."}, status=status.HTTP_404_NOT_FOUND)
        except (AlreadyRegisteredError, WorkshopFullError) as e:
            # 409 Conflict: الطلب يتعارض مع الحالة الحالية للمورد
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            # أي خطأ آخر (مثل DataInconsistencyError) يُعتبر خطأ في الخادم
            return Response({"error": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CancelView(APIView):
    def post(self, request, registration_id):
        serializer = CancelActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        participant_id = serializer.validated_data['participant_id']
        
        try:
            cancel_registration(participant_id, registration_id)
            return Response({"message": "Registration cancelled"}, status=status.HTTP_200_OK)
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found."}, status=status.HTTP_404_NOT_FOUND)
        except AlreadyCancelledError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception:
            return Response({"error": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)