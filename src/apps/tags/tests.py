import json

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, force_authenticate

from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer


class TagListCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('tags:list')
        self.tag_data = {
            'name' : '태그이름',
            'display_name' : '보이는 태그이름',
            'is_use' : 1,
        }
        self.user_data = {
            'id' : 'testuser',
            'name' : '홍길동',
            'email' : 'test@ridi.com',
            'team' : '퍼포먼스팀',
            'password' : 'this_is_secure_password!',
            'is_use' : 1,
        }
        self.user, _ = get_user_model().objects.get_or_create(**self.user_data)
        self.client.force_authenticate(user=self.user)

    def test_can_create_tag(self):
        response = self.client.post(self.url, self.tag_data, format='json')
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        except_data = TagSerializer(Tag.objects.get(name=self.tag_data['name'])).data
        self.assertEqual(json.loads(response.content), except_data)

    def test_get_list_tag(self):
        self.tag = Tag.objects.create(**self.tag_data, creator=self.user)
        response = self.client.get(self.url)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(json.loads(response.content), TagSerializer(Tag.objects.all(), many=True).data)

class TagDetailAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            'id' : 'testuser',
            'name' : '홍길동',
            'email' : 'test@ridi.com',
            'team' : '퍼포먼스팀',
            'password' : 'this_is_secure_password!',
            'is_use' : 1,
        }
        self.tag_data = {
            'name' : '태그이름',
            'display_name' : '보이는 태그이름',
            'is_use' : 1,
        }
        self.user, _ = get_user_model().objects.get_or_create(**self.user_data)
        self.client.force_authenticate(user=self.user)
        self.tag = Tag.objects.create(**self.tag_data, creator=self.user)
        self.url = reverse('tags:detail', kwargs={'pk': self.tag.id})

    #def test_can_show_specific_tag(self):
    #    response = self.client.get(self.url, self.tag_data)
    #    self.assertEqual(status.HTTP_200_OK, response.status_code)
    #    except_data = TagSerializer(self.tag).data
    #    self.assertEqual(json.loads(response.content), except_data)

    def test_can_delete_specific_tag(self):
        before_tag_count = Tag.objects.count()
        response = self.client.delete(self.url)
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)
        self.assertEqual(Tag.objects.count(), before_tag_count-1)

    def test_can_name_update_specific_tag(self):
        before_tag_count = Tag.objects.count()
        be_update_data = self.tag_data
        be_update_data['name'] = 'NEW TAG NAME'
        response = self.client.put(self.url, be_update_data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(json.loads(response.content), TagSerializer(Tag.objects.get(id=self.tag.id)).data)