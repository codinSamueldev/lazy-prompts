from django.urls import reverse
from django.db.models import Count


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
        liked_prompt_ids = set(Like.objects.filter(user=request.user).values_list('prompt_id', flat=True))

    # Fetching hot prompts based on the number of likes
    # Using annotate to count likes and filter prompts with at least one like
    # Ordering by the count of likes in descending order and limiting to 5
    try:
        hot_prompts = list(
            Prompt.objects.annotate(annotated_likes_count=Count('like'))
            .filter(annotated_likes_count__gte=1)
            .order_by('-annotated_likes_count')[:5]
        )
    except Exception as e:
        print(f"Something happened... - {e}")
        hot_prompts = []

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

