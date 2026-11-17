"""
Management command: seed the database with predictable test data.

Usage:
    python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.participants.models import Participant
from apps.workshops.models import Registration, Workshop


class Command(BaseCommand):
    help = 'Reset and seed the database with data ready for testing.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')

        # Registration uses on_delete=PROTECT for both FKs, so registrations
        # must be deleted before workshops and participants.
        Registration.objects.all().delete()
        Workshop.objects.all().delete()
        Participant.objects.all().delete()
        self.stdout.write('Cleared existing data.')

        participants = [
            Participant.objects.create(name='Alice Johnson', email='alice@example.com'),
            Participant.objects.create(name='Bob Smith', email='bob@example.com'),
            Participant.objects.create(name='Carol Williams', email='carol@example.com'),
        ]
        self.stdout.write(f'Created {len(participants)} participants.')

        workshops = [
            Workshop.objects.create(
                title='Django Fundamentals',
                description='Introduction to models, views, and URLs.',
                capacity=2,
            ),
            Workshop.objects.create(
                title='REST API Design',
                description='Building clean APIs with Django REST Framework.',
                capacity=3,
            ),
            # capacity=1 makes the "workshop full" (409) case trivial to test.
            Workshop.objects.create(
                title='Very Limited Workshop',
                description='Single-seat workshop for testing the full-capacity path.',
                capacity=1,
            ),
        ]
        self.stdout.write(f'Created {len(workshops)} workshops.')

        # Print the generated IDs so the evaluator can call the API immediately.
        # Note: IDs follow the database sequence, so they can differ after
        # re-seeding; always use the values printed here.
        self.stdout.write('Seeded participants:')
        for participant in participants:
            self.stdout.write(
                f'  #{participant.id} {participant.name} <{participant.email}>'
            )

        self.stdout.write('Seeded workshops:')
        for workshop in workshops:
            self.stdout.write(
                f'  #{workshop.id} {workshop.title} '
                f'(capacity={workshop.capacity}, seats_taken={workshop.seats_taken})'
            )

        self.stdout.write(self.style.SUCCESS(
            'Successfully seeded data! Ready for testing.'
        ))
