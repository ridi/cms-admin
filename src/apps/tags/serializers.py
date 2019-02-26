from rest_framework import serializers
from .models import Tags 


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags 
        fields = ('id', 'display_name', 'is_use', 'creator', 'reg_date', 'created_at', 'updated_at')