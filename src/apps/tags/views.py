from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response

from .serializers import TagsSerializer
from .models import Tags 

from rest_framework.renderers import JSONRenderer

class TagsList(generics.ListCreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer 

    def list(self, request):
        queryset = self.get_queryset()
        serializer = TagsSerializer(queryset, many=True)
        return Response(serializer.data)