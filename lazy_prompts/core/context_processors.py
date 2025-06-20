def user_auth_state(request):
    """
    Context processor to add user authentication status to the context.
    """
    return {
        'user_auth': request.user.is_authenticated,
        'user': request.user,
        'username': request.user.username if request.user.is_authenticated else None,
        'email': request.user.email if request.user.is_authenticated else None,
    }

def feed_related(request):
    from prompt_posts.models import Topic

    return {'topics': Topic.objects.select_related()[:5]}

