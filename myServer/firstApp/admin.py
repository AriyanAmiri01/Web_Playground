"""
@file admin.py
@brief Django admin panel configuration.

@details
Registers ORM models so they can be managed through
the Django admin interface with custom filters,
search fields, actions, and layout improvements.

@author Ariyan Amiri
@version 1.0
@date 2026-05-22

@see https://github.com/AriyanAmiri01/Web_Playground
"""

# Django admin utilities
from django.contrib import admin

# Application models
from .models import Tag, Project, ProjectLike


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):

    # 
    list_display = ("name", "description")

    # Search Box
    search_fields = ("name", "description")

    # Default sorting
    ordering = ("name",)

    # Filter
    list_filter = ("name",)

    # Azioni personalizzate
    actions = ("clear_description",)

    @admin.action(description="Svuota la descrizione dei tag selezionati")
    def clear_description(self, request, queryset):
        updated = queryset.update(description="")
        self.message_user(
            request,
            f"{updated} descrizione/i dei tag sono state svuotate."
        )