from django.urls import path
from . import views

app_name = 'prompt_posts'

urlpatterns = [
    path('create/', views.create_prompt, name='create_prompt'),
]
