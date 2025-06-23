from django.shortcuts import render
from django.http import JsonResponse

from prompt_posts.models import Prompt


def search_prompts(request):
    """
    Render the search page with the provided arguments.
    
    Args:
        request: The HTTP request object.
        
    Returns:
        Rendered search page.
    """

    keywords = request.GET.get('keywords', None)
    by_title = request.GET.get('search-title', None)
    by_prompt = request.GET.get('search-prompt', None)

    if not keywords and not by_title and not by_prompt:
        # If no search criteria are provided, show an error.
        return JsonResponse({'error': 'No search criteria provided.'}, status=400)
    
    # Determine if the search is by title or prompt.
    selected_search = None
    message = None
    prompts = None

    if by_title:
        selected_search = by_title
        message = "You have searched by title."
        prompts = Prompt.objects.filter(title__icontains=keywords).distinct()
        print(prompts, prompts.exists(), prompts.count())

    elif by_prompt:
        selected_search = by_prompt
        message = "You have searched by prompt."
        prompts = Prompt.objects.filter(content__icontains=keywords).distinct()

    
    # If message is None, or did not found prompts, return a 404.
    if (not message) or (not prompts.exists()):
        return JsonResponse({'error': 'Ooops : (, we did not found that.'}, status=404)

    context = {
        'keywords': keywords,
        'selected_search': selected_search,
        'message': message,
        'prompts': prompts,
    }

    return render(request, 'search.html', context)


