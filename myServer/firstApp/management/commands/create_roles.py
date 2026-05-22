"""
@file create_role.py
@brief A command line, command extension for role creations

@details
I wrote this command, so i don't need to create the roles
manually everytime via the admin panel. To use this command
simply use "python manage.py create_roles" and the roles are 
ready to use. This craetes 3 group for those roles.
@author Ariyan Amiri
@version 1.0
@date 2026-05-22

@see https://github.com/AriyanAmiri01/Web_Playground
"""

# Import Django base command utilities
from django.core.management.base import BaseCommand

# Import Django authentication group model
from django.contrib.auth.models import Group

# Custom Django management command
class Command(BaseCommand):

    # Help message shown in the terminal
    # Used with python manage.py create-roles --help
    help = "Creates default roles"

    # Main entry point of the command
    def handle(self, *args, **kwargs):
        # Roles to be created
        roles = [
            "admin",
            "client",
            "user"
        ]

        # Create each role if it does not already exist
        for role in roles:
            Group.objects.get_or_create(name=role)

        # Display success message
        self.stdout.write(
            self.style.SUCCESS("Roles created successfully.")
        )