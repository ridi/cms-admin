import json
import random
import logging
logging.getLogger('faker.factory').setLevel(logging.WARNING)
from faker import Faker

from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from apps.menus.models import Menu
from apps.menus.serializers import MenuSerializer

# not printing "Faker/faker.factory" debug message as a stdout

'''
[
    {
        "menu_title":"새로운매뉴",
        "menu_url":"/super/new",
        "menu_deep":0,"menu_order":16,
        "is_newtab":false,
        "is_use":true,
        "is_show":true
    }
]
'''
class MenuRetrieveUpdateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.fake = Faker('ko_KR')
        self.menu_data = {
            'menu_title' : self.fake.word(),
            'menu_url' : '/' + self.fake.uri_path(),
            'menu_deep' : 0,
            'menu_order': 1,
            'is_newtab' : 0,
            'is_use' : 1,
            'is_show' : 1,
        }
        self.url = reverse('menus:list')


    def test_can_list_menus(self):
        self.menu = Menu.objects.create(**self.menu_data)
        response = self.client.get(self.url)
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        except_response = MenuSerializer(Menu.objects.all(), many=True).data
        self.assertEqual(json.loads(response.content), except_response)

    def test_can_create_menu(self):
        response = self.client.post(self.url, self.menu_data)
        self.assertEqual(status.HTTP_201_CREATED, response.status_code, response.data)
        self.assertTrue(Menu.objects.filter(menu_title=self.menu_data['menu_title']).exists())

    def test_can_update_single_menu(self):
        update_menu = MenuSerializer(Menu.objects.create(**self.menu_data)).data
        new_menu_title = self.fake.word()
        update_menu['menu_title'] = new_menu_title
        response = self.client.put(self.url, update_menu)
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.assertEqual(new_menu_title, Menu.objects.get(id=update_menu['id']).menu_title)

    def test_can_update_multiple_menu(self):
        Menu.objects.bulk_create(self._generate_menus())
        menus = MenuSerializer(Menu.objects.all(), many=True).data
        last_menu = menus.pop()
        last_menu['menu_order'] = 0
        list(map(lambda m: m.update({'menu_order': m['menu_order'] + 1}), menus)) # Push it back a other menus
        menus.append(last_menu)
        response = self.client.put(self.url, menus)
        self.assertEqual(status.HTTP_200_OK, response.status_code, response.data)
        self.assertEqual(menus, MenuSerializer(Menu.objects.all(), many=True).data)


    def _generate_menus(self, total=5):
        menus = (Menu(**{'menu_title' : self.fake.word(),
            'menu_url' : '/' + self.fake.uri_path(),
            'menu_deep' : 0,
            'menu_order': i,
            'is_newtab' : 0,
            'is_use' : 1,
            'is_show' : 1,
        }) for i in range(total))
        return menus
