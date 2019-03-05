import json
import logging
from faker import Faker

from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model

from rest_framework.test import APITestCase, force_authenticate
from rest_framework import status

from apps.groups.models import Group
from apps.groups.serializers import GroupSerializer

# not printing "Faker/faker.factory" debug message as a stdout
logging.getLogger('faker.factory').setLevel(logging.WARNING)


class GroupListCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.fake = Faker('ko_KR')
        self.url = reverse('groups:list')
        self.group_data = {
            'name' : self.fake.name() + '팀',
            'is_use' : 1,
        }
        self.user_data = {
            'id' : self.fake.user_name(),
            'name' : self.fake.name(),
            'email' : self.fake.email(),
            'team' : self.fake.job() + '팀',
            'password' : self.fake.password(),
            'is_use' : 1,
        }
        self.user, _ = get_user_model().objects.get_or_create(**self.user_data)
        self.client.force_authenticate(user=self.user)

    def test_can_list_groups(self):
        self.group = Group.objects.create(**self.group_data, creator=self.user)
        response = self.client.get(self.url)
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        except_response = GroupSerializer(Group.objects.all(), many=True).data
        self.assertEqual(json.loads(response.content), except_response)

    def test_can_create_group(self):
        response = self.client.post(self.url, self.group_data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        self.assertTrue(Group.objects.filter(name=self.group_data['name']).exists())

class GroupDetailsAPIViewTestCase(APITestCase):
    def setUp(self):
        self.fake = Faker('ko_KR')
        self.group_data = {
            'name' : self.fake.name() + '팀',
            'is_use' : 1,
        }
        self.user_data = {
            'id' : self.fake.user_name(),
            'name' : self.fake.name(),
            'email' : self.fake.email(),
            'team' : self.fake.job() + '팀',
            'password' : self.fake.password(),
            'is_use' : 1,
        }
        self.user, _ = get_user_model().objects.get_or_create(**self.user_data)
        self.client.force_authenticate(user=self.user)
        self.group = Group.objects.create(**self.group_data, creator=self.user)
        self.url = reverse('groups:detail', kwargs={'pk' : self.group.id})

    def test_can_delete_specific_group(self):
        response = self.client.delete(self.url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertFalse(Group.objects.filter(id=self.group.id).exists())

