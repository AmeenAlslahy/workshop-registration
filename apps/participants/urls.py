from django.urls import path
from .views import ParticipantListView

urlpatterns = [
    path('participants/', ParticipantListView.as_view(), name='participant-list'),
]