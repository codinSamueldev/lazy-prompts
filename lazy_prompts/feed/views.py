from django.shortcuts import render
from prompt_posts.models import Prompt


def home(request):
    prompts = Prompt.objects.all()
    return render(request, 'home.html', {'prompts': prompts})



