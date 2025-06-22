from django.shortcuts import render

def search_prompts(request):
    """
    Render the search page with the provided arguments.
    
    Args:
        request: The HTTP request object.
        args: The keywords searched by the user.
        
    Returns:
        Rendered search page.
    """

    args = request.GET.get('search', '')

    return render(request, 'search.html', {'args': args})


