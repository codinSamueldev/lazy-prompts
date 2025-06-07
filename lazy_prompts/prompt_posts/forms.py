from django import forms
from .models import Prompt, Topic

class PromptCreateForm(forms.ModelForm):
    class Meta:
        model = Prompt
        fields = ['title', 'description', 'content', 'topic', 'image']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter your prompt title'}),
            'description': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter a brief description...'}),
            'content': forms.Textarea(attrs={'class': 'form-textarea', 'placeholder': 'Paste your prompt content here...'}),
            'topic': forms.Select(attrs={'class': 'form-select'}),
            'image': forms.FileInput(attrs={'class': 'form-file-input'})
        }
