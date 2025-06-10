from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .allowed_email_providers import PROVIDERS


class UserRegistrationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ("username", "email", "first_name", "last_name")

    def clean_email(self):
        email = self.cleaned_data.get("email")

        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already in use.")

        domain = email.split("@")[-1]
        if domain not in PROVIDERS:
            raise forms.ValidationError("Please use another email address.")
        return email


class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)

