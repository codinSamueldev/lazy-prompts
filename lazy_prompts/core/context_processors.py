from django.urls import reverse


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
    from prompt_posts.models import Topic, Prompt
    from likes.models import Like

    liked_prompt_ids = set()

    if request.user.is_authenticated:
        # Get a set of prompt IDs the current user has liked.
        liked_prompt_ids = set(Like.objects.filter(user=request.user).values_list('prompt_id', flat=True))

    # Fetch top 5 hot prompts.
    counter = 0
    hot_prompts = []

    for prompt in Prompt.objects.all():
        if counter == 4:
            break

        if prompt.likes_count >= 1:
            counter += 1
            hot_prompts.append(prompt)


    return {
            'topics': Topic.objects.select_related()[:5],
            'user_liked_prompt_ids': liked_prompt_ids,
            'hot_prompts': hot_prompts,
    }

def links(request):
    try:
        toggle_like_url = reverse("likes:toggle_like")
        login_url = reverse("users:my_login")
    except:
        toggle_like_url = ""
        login_url = ""

    return {
            'toggle_like_url': toggle_like_url,
            'login_url': login_url,
            }

