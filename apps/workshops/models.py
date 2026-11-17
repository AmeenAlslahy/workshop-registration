from django.db import models
from django.db.models import Q, F

class Workshop(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    capacity = models.PositiveIntegerField()
    seats_taken = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workshops'
        ordering = ['id']
        constraints = [
            models.CheckConstraint(
                check=Q(capacity__gt=0),
                name='workshop_capacity_positive'
            ),
            models.CheckConstraint(
                check=Q(seats_taken__gte=0) & Q(seats_taken__lte=F('capacity')),
                name='workshop_seats_within_capacity'
            )
        ]

    def __str__(self):
        return self.title
    

class Registration(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        CANCELLED = 'cancelled', 'Cancelled'

    participant = models.ForeignKey(
        'participants.Participant', 
        on_delete=models.PROTECT, 
        related_name='registrations'
    )
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.PROTECT, 
        related_name='registrations'
    )
    status = models.CharField(
        max_length=10, 
        choices=Status.choices, 
        default=Status.ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'registrations'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['participant', 'workshop'],
                condition=Q(status='active'),
                name='unique_active_registration_per_workshop'
            ),
            models.CheckConstraint(
                check=(
                    Q(status='active', cancelled_at__isnull=True) |
                    Q(status='cancelled', cancelled_at__isnull=False)
                ),
                name='registration_cancelled_at_consistent'
            )
        ]

    def __str__(self):
        return f"{self.participant.name} - {self.workshop.title} ({self.status})"