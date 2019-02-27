from rest_framework import generics
from rest_framework.response import Response

from .serializers import GorupSerializer
from .models import Group

from rest_framework.renderers import JSONRenderer

class GroupListCreateAPIView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GorupSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = GorupSerializer(queryset, many=True)
        return Response(serializer.data)

class GroupDetailsAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GorupSerializer
    pass
