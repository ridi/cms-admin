from django.urls import path

from apps.users import views


app_name = 'users'

urlpatterns = [
    path('', views.UserListCreateAPIView.as_view(), name='list'),
    path('<str:pk>/', views.UserDetailAPIView.as_view(), name="detail"),
]