from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

from .forms import UserRegistrationForm, UserLoginForm


def user_logged_in_redirect(request) -> bool:
    if request.user.is_authenticated:
        return True

    return False


def registration_view(request):
    """
    View that allows users to register into the platform.
    """

    # Validate if user is logged-in.
    if user_logged_in_redirect(request):
        return redirect("feed:home")


    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("users:my_login")

    else:
        form = UserRegistrationForm()

    return render(request, "register.html", {"form":form})


def my_login(request):
    

    # Validate if user is logged-in.
    if user_logged_in_redirect(request):
        return redirect("feed:home")

    if request.method == "GET":
        form = UserLoginForm()
        return render(request, "my_login.html", {"form":form})
    
    # Handle log-in auth flow.
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
        
