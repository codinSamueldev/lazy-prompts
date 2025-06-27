from django.urls import path

from . import views


app_name = 'likes'

urlpatterns = [
        path('toggle-like/', views.toggle_like, name="toggle_likes"),
]

