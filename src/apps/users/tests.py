import json

from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from apps.users.models import User
from apps.users.serializers import UserSerializer

from django.forms.models import model_to_dict

class UserListCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('users:list')
        self.user_data = {
            'id' : 'testuser',
            'name' : '홍길동',
            'email' : 'test@ridi.com',
            'team' : '퍼포먼스팀',
            'passwd' : 'this_is_secure_password!',
            'is_use' : 1,
        }

    def test_can_create_user(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        except_data = UserSerializer(User.objects.get(pk=self.user_data['id'])).data
        self.assertEqual(json.loads(response.content), except_data)

    def test_get_list_user(self):
        self.user = User.objects.create(**self.user_data)
        response = self.client.get(self.url)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(json.loads(response.content), UserSerializer(User.objects.all(), many=True).data)

class UserDetailAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            'id' : 'testuser',
            'name' : '홍길동',
            'email' : 'test@ridi.com',
            'team' : '퍼포먼스팀',
            'passwd' : 'this_is_secure_password!',
            'is_use' : 1,
        }
        self.user = User.objects.create(**self.user_data)
        self.url = reverse('users:detail', kwargs={'pk': self.user.id})

    def test_can_show_specific_user(self):
        response = self.client.get(self.url, self.user_data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        except_data = UserSerializer(self.user).data
        self.assertEqual(json.loads(response.content), except_data)