
from rest_framework import mixins, generics, status
from rest_framework.response import Response

from .serializers import TagSerializer
from .models import Tag

from rest_framework.renderers import JSONRenderer

from django.contrib.auth import get_user_model

class TagListCreateAPIView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = TagSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(creator=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class TagDetailsAPIView(generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pass