from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response

from .serializers import TagSerializer
from .models import Tag

from rest_framework.renderers import JSONRenderer

class TagListCreateAPIView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = TagSerializer(queryset, many=True)
        return Response(serializer.data)

class TagDetailsAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pass