from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from apps.participants.models import Participant
from apps.workshops.models import Workshop, Registration


class WorkshopAPITests(APITestCase):
    def setUp(self):
        self.participant = Participant.objects.create(name="Ali", email="ali@test.com")
        self.workshop = Workshop.objects.create(title="Test Workshop", capacity=1)

        self.list_url = reverse('workshop-list')
        self.register_url = reverse('workshop-register', args=[self.workshop.id])

    def test_list_workshops_requires_participant_id(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_workshops_returns_correct_data(self):
        response = self.client.get(
            f"{self.list_url}?participant_id={self.participant.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Test Workshop")
        self.assertEqual(response.data[0]['available_seats'], 1)
        self.assertIsNone(response.data[0]['active_registration_id'])

    def test_list_workshops_rejects_non_numeric_participant_id(self):
        response = self.client.get(f"{self.list_url}?participant_id=abc")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('participant_id', response.data)

    def test_list_workshops_returns_404_for_unknown_participant(self):
        response = self.client.get(f"{self.list_url}?participant_id=999999")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Participant not found.")

    def test_register_unknown_participant_returns_404(self):
        response = self.client.post(
            self.register_url,
            {'participant_id': 999999},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Participant not found.")

        self.workshop.refresh_from_db()
        self.assertEqual(self.workshop.seats_taken, 0)
        self.assertEqual(Registration.objects.count(), 0)

    def test_register_success(self):
        response = self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.workshop.refresh_from_db()
        self.assertEqual(self.workshop.seats_taken, 1)

    def test_register_duplicate_returns_409(self):
        self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        response = self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn("already has an active registration", response.data['error'])

    def test_register_full_workshop_returns_409(self):
        p2 = Participant.objects.create(name="Sara", email="sara@test.com")
        self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )

        response = self.client.post(
            self.register_url,
            {'participant_id': p2.id},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn("Workshop is full", response.data['error'])

    def test_cancel_registration_success(self):
        self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        reg = Registration.objects.get(participant=self.participant)
        cancel_url = reverse('registration-cancel', args=[reg.id])

        response = self.client.post(
            cancel_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.workshop.refresh_from_db()
        self.assertEqual(self.workshop.seats_taken, 0)

    def test_cancel_already_cancelled_returns_409(self):
        self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        reg = Registration.objects.get(participant=self.participant)
        cancel_url = reverse('registration-cancel', args=[reg.id])

        self.client.post(
            cancel_url,
            {'participant_id': self.participant.id},
            format='json'
        )
        response = self.client.post(
            cancel_url,
            {'participant_id': self.participant.id},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertIn("already cancelled", response.data['error'])

    def test_unknown_participant_message_follows_accept_language(self):
        response = self.client.get(
            f"{self.list_url}?participant_id=999999",
            HTTP_ACCEPT_LANGUAGE='ar',
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'لم يتم العثور على المشارك.')
        self.assertIn('Accept-Language', response['Vary'])

    def test_register_success_message_follows_accept_language(self):
        response = self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json',
            HTTP_ACCEPT_LANGUAGE='ar',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'تم التسجيل بنجاح')

    def test_workshop_full_message_follows_accept_language(self):
        p2 = Participant.objects.create(name="Sara", email="sara@test.com")
        self.client.post(
            self.register_url,
            {'participant_id': self.participant.id},
            format='json',
        )

        response = self.client.post(
            self.register_url,
            {'participant_id': p2.id},
            format='json',
            HTTP_ACCEPT_LANGUAGE='ar',
        )

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'الورشة ممتلئة.')

    def test_validation_errors_follow_accept_language(self):
        response = self.client.post(
            self.register_url,
            {},
            format='json',
            HTTP_ACCEPT_LANGUAGE='ar',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['participant_id'][0], 'هذا الحقل مطلوب.')