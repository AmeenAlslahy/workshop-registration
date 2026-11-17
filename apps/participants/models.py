from django.db import models

class Participant(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'participants'
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.email})"