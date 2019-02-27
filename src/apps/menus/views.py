from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response

from .serializers import MenuSerializer
from .models import Menu

from rest_framework.renderers import JSONRenderer

class MenuListCreateUpdateAPIView(generics.GenericAPIView,
                                  generics.ListModelMixin,
                                  generics.CreateModelMixin,
                                  generics.UpdateModelMixin):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = MenuSerializer(queryset, many=True)
        return Response(serializer.data)