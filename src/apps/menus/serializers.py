from django.db import models

from rest_framework import serializers
from .models import Menu


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = (
            'id',
            'menu_title',
            'menu_url',
            'menu_deep',
            'menu_order',
            'is_use',
            'is_newtab',
            'reg_date',
            'created_at',
            'updated_at',
        )