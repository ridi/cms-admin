from rest_framework import serializers
from .models import Tag
from apps.users.serializers import UserSerializer


class TagSerializer(serializers.HyperlinkedModelSerializer):
    creator =  UserSerializer(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Tag
        fields = ('id', 'name', 'display_name', 'is_use', 'creator', 'created_at', 'updated_at')
        # be added fields; inactive_tags, menus_count, active_tags