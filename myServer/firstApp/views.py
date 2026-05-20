from django.shortcuts import render
from django.http import HttpResponse


# For authentication
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required

# For roles 
from django.contrib.auth.decorators import login_required, user_passes_test
from .roles import is_admin, is_client, is_user

from .forms import RegisterForm
# Create your views here.

def getIndex(request):
    return render(request, "index.html")

    
def getContact(request):
    return render(request, "contact.html")

    
def getProjects(request):
    return render(request, "projects.html")

def getAbout(request):
    return render(request, "about.html")

def getUserProf(request):
    return render(request, "user-profile.html")

    
def getAuthenticate(request):
    return render(request, "authenticate.html")



# Authentication Stuffs
def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("home")
    else:
        form = RegisterForm()

    return render(request, "accounts/register.html", {"form": form})


@login_required
def home_view(request):
    return render(request, "accounts/home.html")


@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    return render(request, "admin-dashboard.html")


@login_required
@user_passes_test(is_client)
def client_dashboard(request):
    return render(request, "client-dashboard.html")


@login_required
@user_passes_test(is_user)
def user_dashboard(request):
    return render(request, "user-dashboard.html")