
from django.urls import path

from apps.tags import views


app_name = 'tags'

urlpatterns = [
    path('', views.TagListCreateAPIView.as_view(), name='list'),
    path('<int:pk>/', views.TagDetailsAPIView.as_view(), name="detail"),
]