from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ValidationError, ParseError

from apps.menus.serializers import MenuSerializer
from apps.menus.models import Menu

class MenuRetrieveUpdateAPIView(generics.ListCreateAPIView, generics.UpdateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        menus = list ()
        request_data = request.data
        if isinstance(request_data, dict):
            request_data = [request_data]

        for menu_data in request_data:
            _id = menu_data.pop('id')
            obj, _ = Menu.objects.update_or_create(id=_id, defaults=menu_data)
            menus.append(obj)

        serializer = self.get_serializer(menus, many=True)
        return Response(serializer.data)

    def get_object(self, id):
        return Menu.objects.get_object_or_404(id=id)
