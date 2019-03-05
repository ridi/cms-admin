from django.db import models

from rest_framework import serializers

from apps.groups.models import Group
from apps.users.serializers import UserSerializer


class GroupSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Group
        fields = ('id', 'name', 'is_use', 'creator', 'created_at', 'updated_at')