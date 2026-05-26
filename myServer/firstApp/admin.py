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
    # @brief 
    # Project customization

    # Columns displayed in admin list view
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    # @brief 
    # Project customization

    # Columns displayed in admin list view
    list_display = (
        "title",
        "category",
        "status",
        "start_date",
        "end_date",
        "likes_count",
    )

    # Right-side filtering panel
    list_filter = (
        "status",
        "category",
        "start_date",
        "tags",
    )

    # Search bar fields
    search_fields = (
        "title",
        "description",
        "github_link",
    )

    # Default ordering
    ordering = ("-start_date",)

    # Better many-to-many selection UI
    filter_horizontal = ("tags",)

    # Read-only computed fields
    readonly_fields = ("likes_count",)

    # Function for like counts
    def likes_count(self, obj):
       #  @brief Returns total number of likes.
        return obj.likes.count()
    likes_count.short_description = "Likes"




@admin.register(ProjectLike)
class ProjectLikeAdmin(admin.ModelAdmin):
    """
    @brief Custom admin configuration for ProjectLike model.
    """

    list_display = (
        "project",
        "user",
        "created_at",
    )

    list_filter = (
        "created_at",
        "project",
    )

    search_fields = (
        "project__title",
        "user__username",
    )

    readonly_fields = ("created_at",)