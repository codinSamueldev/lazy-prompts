from django.urls import path
from . import views

app_name = 'search'

urlpatterns = [
    path('', views.search_prompts, name='search_prompts'),
    #path('autocomplete/', views.autocomplete, name='autocomplete'),
]
