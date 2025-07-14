from django.urls import path

from .views import home, load_more_posts, hot_prompts


app_name = 'feed'

urlpatterns = [
    path('', home, name="home"),
    path('load-more/', load_more_posts, name="load_more_posts"),
    path('hot/<slug:slug>', hot_prompts, name="hot"),
]


