from rest_framework import serializers
from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'display_name', 'is_use', 'creator', 'reg_date', 'created_at', 'updated_at')