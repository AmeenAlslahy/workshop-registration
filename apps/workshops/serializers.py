from rest_framework import serializers
from .models import Workshop

class WorkshopSerializer(serializers.ModelSerializer):
    available_seats = serializers.SerializerMethodField()
    active_registration_id = serializers.SerializerMethodField()
    last_registration = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'title', 'description', 'capacity', 
            'seats_taken', 'available_seats', 
            'active_registration_id', 'last_registration'
        ]

    def get_available_seats(self, obj):
        return obj.capacity - obj.seats_taken

    def get_active_registration_id(self, obj):
        # نصل إلى التسجيلات التي تم جلبها مسبقاً عبر Prefetch (في الـ View)
        registrations = getattr(obj, 'participant_registrations', [])
        active = next((r for r in registrations if r.status == 'active'), None)
        return active.id if active else None

    def get_last_registration(self, obj):
        registrations = getattr(obj, 'participant_registrations', [])
        if not registrations:
            return None
        last = registrations[0] # لأننا سنرتبها تنازلياً في الـ View
        return {
            'id': last.id,
            'status': last.status,
            'created_at': last.created_at,
            'cancelled_at': last.cancelled_at
        }

class ParticipantIdQuerySerializer(serializers.Serializer):
    participant_id = serializers.IntegerField(min_value=1)

class RegisterActionSerializer(serializers.Serializer):
    participant_id = serializers.IntegerField(min_value=1)

class CancelActionSerializer(serializers.Serializer):
    participant_id = serializers.IntegerField(min_value=1)