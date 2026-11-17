from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Participant

class ParticipantListView(APIView):
    def get(self, request):
        # نرجع فقط الحقول التي تحتاجها الواجهة
        participants = Participant.objects.all().values('id', 'name', 'email')
        return Response(list(participants))