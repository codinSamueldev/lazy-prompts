from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.template.loader import render_to_string

from prompt_posts.models import Prompt, Topic
from prompt_posts.forms import PromptCreateForm


def home(request):
    """
    Render the home page with paginated prompts.
    """

    prompts = Prompt.objects.select_related('author', 'topic')
    topics = Topic.objects.select_related('prompt_set')[:5]

    paginator = Paginator(prompts, 3) # 3 Posts per page.
    page_1 = paginator.get_page(1) # Initial load with 3 posts.

    context = {
        'prompts': page_1,
        'topics': topics,
        'has_next': page_1.has_next(),
        'next_page_number': page_1.next_page_number() if page_1.has_next() else None,
        'form': PromptCreateForm()
    }


    return render(request, 'home.html', context)


def load_more_posts(request):
    """
    AJAX endpoint to load more posts.
    """
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        page_number = request.GET.get("page", 1)

        prompts = Prompt.objects.select_related('author', 'topic')
        paginator = Paginator(prompts, 3)
        page = paginator.get_page(page_number)

        # Render just the posts HTML
        posts_html = render_to_string('layouts/partials/feed/posts.html', context={'prompts': page}, request=request)

        return JsonResponse({
            'posts_html': posts_html,
            'has_next': page.has_next(),
            'next_page_number': page.next_page_number() if page.has_next() else None,
        })

    return JsonResponse({"error": "Invalid request"}, status=400)
