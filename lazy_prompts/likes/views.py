from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404 
from django.views.decorators.http import require_POST

from prompt_posts.models import Prompt
from .models import Like


@require_POST
def toggle_like(request) -> JsonResponse:
    """
    This view is responsible for handling the like toggle functionality.
    
    Returns:
        *JSON response so the front-end handles the rest with the returned data.
    """

    if not request.user.is_authenticated:
        return JsonResponse(
                {'error': 'Authentication required. Please log in to like prompts.'},
                status=401
                )

    prompt_id = request.POST.get('prompt_id', None)
    user = request.user


    if not prompt_id:
        return JsonResponse(
                {'error': 'Prompt ID is missing...'},
                status=400
                )

    try:
        prompt = get_object_or_404(Prompt, id=prompt_id)
    except Prompt.DoesNotExist:
        return JsonResponse(
                {'error': 'No prompt found with the given id...'},
                status=404
                )

    # If the user has liked the prompt, then 'dislike' it. Otherwise, 'like' the prompt.
    liked = None

    try:
        like = Like.objects.get(user=user, prompt=prompt)
        like.delete()
        liked = False
    except Like.DoesNotExist:
        Like.objects.create(user=user, prompt=prompt)
        liked = True

    # Get likes count.
    new_like_count = prompt.likes_count


    return JsonResponse(
            {
                'prompt_id': prompt_id,
                'is_liked': liked,
                'new_like_count': new_like_count,
            },
            status=200)

