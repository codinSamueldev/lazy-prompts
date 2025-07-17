"""
URL configuration for lazy_prompts project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('super-secret-lazy-admin/', admin.site.urls),
    path('', include('feed.urls', namespace='feed')),
    path('u/', include('users.urls', namespace='users')),
    path('accounts/', include('allauth.urls')),
    path('likes/', include('likes.urls', namespace='likes')),
    path('posts/', include('prompt_posts.urls', namespace='prompt_posts')),
    path('search/', include('search.urls', namespace='search')),
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Lazy Prompts Admin"
admin.site.site_title = "Lazy Prompts Admin Portal"
admin.site.index_title = "Bienvenido/a Lazy Prompts Portal"

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
