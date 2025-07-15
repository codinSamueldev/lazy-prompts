from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.paginator import Paginator

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


@login_required
def profile(request, username):
    """
    Display the user's profile with paginated prompts (3 per page).

    Args:
        request (HttpRequest): The HTTP request object.
        username (str): The username of the profile to display.

    Returns:
        HttpResponse: Rendered profile page or JSON error if not found.

    Raises:
        User.DoesNotExist: If the user does not exist.
    """
    try:
        user_profile = User.objects.prefetch_related("prompt_set").get(username=username)
        prompts = user_profile.prompt_set.all()
        paginator = Paginator(prompts, 3)  # 3 posts per page

        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)

        return render(
            request,
            "profile.html",
            {"user_profile": user_profile, "page_obj": page_obj}
        )
    except User.DoesNotExist:
        return JsonResponse({"error": f"{username} not found!"}, status=404)
    except Exception as e:
        # Log the error properly in production
        print(f"\n\n\n Something happened... - {e} \n\n\n")
        return JsonResponse({"error": "An unexpected error occurred."}, status=500)

