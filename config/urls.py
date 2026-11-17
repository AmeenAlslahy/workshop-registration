from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.participants.urls')),
    path('api/', include('apps.workshops.urls')),
]