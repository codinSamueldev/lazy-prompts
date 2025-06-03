from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

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
    if request.method == "GET":
        form = UserLoginForm()
        return render(request, "my_login.html", {"form":form})

    if request.method == "POST":
        form = UserLoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("feed:home")
            else:
                form.add_error(None, "Invalid username or password")
                return render(request, "my_login.html", {"form":form})


@login_required
def user_logout(request):
    logout(request)
    return redirect("feed:home")
        