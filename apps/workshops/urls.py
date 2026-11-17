from django.urls import path
from .views import WorkshopListView, RegisterView, CancelView

urlpatterns = [
    path('workshops/', WorkshopListView.as_view(), name='workshop-list'),
    path('workshops/<int:workshop_id>/register/', RegisterView.as_view(), name='workshop-register'),
    path('registrations/<int:registration_id>/cancel/', CancelView.as_view(), name='registration-cancel'),
]