from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('login/', views.my_login, name='my_login'),
    path('register/', views.registration_view, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('<str:username>/', views.profile, name='profile'),
]
