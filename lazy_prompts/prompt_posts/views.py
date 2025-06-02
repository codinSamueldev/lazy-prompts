from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required

from .forms import PromptCreateForm
from .models import Prompt

@login_required
def create_prompt(request):
    """Handle prompt creation via AJAX."""
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' and request.method == 'POST':
        form = PromptCreateForm(request.POST, request.FILES)
        if form.is_valid():
            prompt = form.save(commit=False)
            prompt.author = request.user
            prompt.save()
            
            # Get the first page of prompts to return updated content
            prompts = Prompt.objects.all()[:3]
            posts_html = render_to_string('partials/posts.html', {'prompts': prompts}, request=request)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Prompt created successfully!',
                'posts_html': posts_html
            })
        else:
            return JsonResponse({
                'status': 'error',
                'errors': form.errors
            }, status=400)
            
    return JsonResponse({'error': 'Invalid request'}, status=400)
