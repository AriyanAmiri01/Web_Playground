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

# Checks whether the user belongs to the admin group
def is_admin(user):
    return user.groups.filter(name="admin").exists()


# Checks whether the user belongs to the client group
def is_client(user):
    return user.groups.filter(name="client").exists()


# Checks whether the user belongs to the user group
def is_user(user):
    return user.groups.filter(name="user").exists()