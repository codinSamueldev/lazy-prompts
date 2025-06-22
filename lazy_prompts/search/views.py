from django.shortcuts import render
from django.http import JsonResponse


def search_prompts(request):
    """
    Render the search page with the provided arguments.
    
    Args:
        request: The HTTP request object.
        args: The keywords searched by the user.
        
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

    if by_title:
        selected_search = by_title
        message = "You have searched by title."

    elif by_prompt:
        selected_search = by_prompt
        message = "You have searched by prompt."

    context = {
        'keywords': keywords,
        'selected_search': selected_search,
        'message': message,
    }

    return render(request, 'search.html', context)


