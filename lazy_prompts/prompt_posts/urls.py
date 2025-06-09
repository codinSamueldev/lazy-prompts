from django.urls import path
from . import views

app_name = 'prompt_posts'

urlpatterns = [
    path('create/', views.create_prompt, name='create_prompt'),
    path('topic/<slug:slug>/', views.topic_prompts, name='topic_prompts'),
]
