
from django.urls import path

from apps.groups import views


app_name = 'groups'

urlpatterns = [
    path('', views.GroupListCreateAPIView.as_view(), name='list'),
    path('<int:pk>', views.GroupDetailsAPIView.as_view(), name="detail"),
]