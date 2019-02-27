from django.db import models

from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'is_use', 'creator', 'created_at', 'updated_at')