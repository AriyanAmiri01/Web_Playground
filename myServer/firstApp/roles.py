"""
@file role.py
@brief Role management helper functions.

@details
I used it to defines helper functions used to check whether a user
belongs to a specific role/group. These functions are
useful for authorization, protected views, rendering
restricted pages, and handling privileged requests.

@author Ariyan Amiri
@version 1.0
@date 2026-05-22

@see https://github.com/AriyanAmiri01/Web_Playground
"""


from django.shortcuts import redirect
from django.contrib import messages
from functools import wraps

# Checks whether the user belongs to the admin group
def is_admin(user):
    return user.groups.filter(name="admin").exists()

# Checks whether the user belongs to the client group
def is_client(user):
    return user.groups.filter(name="client").exists()

# Checks whether the user belongs to the user group
def is_user(user):
    return user.groups.filter(name="user").exists()

# Checks whether the user belongs to the user group But with message box
def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must login first.")
            return redirect("authenticate")

        if not request.user.groups.filter(name="admin").exists():
            messages.error(
                request,
                "You do not have permission to access this page."
            )
            return redirect("login")

        return view_func(request, *args, **kwargs)

    return wrapper

# Checks whether the user belongs to the user group But with message box
def client_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must login first.")
            return redirect("authenticate")

        if not request.user.groups.filter(name="client").exists():
            messages.error(
                request,
                "You do not have permission to access this page."
            )
            return redirect("home")

        return view_func(request, *args, **kwargs)

    return wrapper

# Checks whether the user belongs to the user group But with message box
def user_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "You must login first.")
            return redirect("authenticate")

        if not request.user.groups.filter(name="user").exists():
            messages.error(
                request,
                "You do not have permission to access this page."
            )
            return redirect("home")

        return view_func(request, *args, **kwargs)

    return wrapper
