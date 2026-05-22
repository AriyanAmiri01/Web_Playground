"""
@file admin.py
@brief Django admin panel configuration.

@details
Registers ORM models so they can be managed through
the Django admin interface.

@author Ariyan Amiri
@version 1.0
@date 2026-05-22

@see https://github.com/AriyanAmiri01/Web_Playground
"""

# Django admin utilities
from django.contrib import admin

# Application models
from .models import Tag, Project

# Register models with the admin panel
admin.site.register(Tag)
admin.site.register(Project)