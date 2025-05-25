from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

from .forms import UserRegistrationForm, UserLoginForm


def registration_view(request):
    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("feed:home")

    else:
        form = UserRegistrationForm()

    return render(request, "register.html", {"form":form})


def my_login(request):
    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            return redirect("feed:home")

    else:
        form = UserLoginForm()

    return render(request, "my_login.html", {"form":form})


@login_required
def user_logout(request):
    logout(request)
    return redirect("feed:home")
        