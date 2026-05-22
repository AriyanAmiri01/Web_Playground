"""
@file models.py
@brief Database models for the portfolio application.

@details
This module defines the database schema for projects and tags
using the Django ORM. Each project record represents a project
in my portfolio.

@author Ariyan Amiri
@version 1.0
@date 2026-05-22
@see https://github.com/AriyanAmiri01/Web_Playground
"""

# Django Object Relation Mapping stuffs and interfaces
from django.db import models

# Validation Stuff
from django.core.exceptions import ValidationError

# The Model that gives info about what is project all about
class Tag(models.Model):
    #: Unique name of the tag
    name = models.CharField(max_length=50, unique=True)

    #: I just put it the for textual description of the tag
    description = models.TextField(blank=True)

    def __str__(self):
        """
        @brief Returns the string representation of the tag.
        @return Tag name.
        """
        return self.name

class Project(models.Model):
    """
    @class Project
    @brief Represents a goodies that i did in past.
    @details
    Stores metadata about projects including status,
    associated tags, GitHub repository, and scheduling data.
    """


    #: Available project status values
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    #: Unique project title
    title = models.CharField(max_length=100, unique=True)

    #: Detailed project description
    description = models.TextField()

    #: Tags associated with the project
    tags = models.ManyToManyField(Tag)

    #: GitHub repository URL
    github_link = models.URLField(blank=True)

    #: Project start date
    start_date = models.DateField()

     #: Project completion date
    end_date = models.DateField(null=True, blank=True)

    #: Current project status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="planned"
    )
    
    # Periodic validation for consistency
    def clean(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValidationError("End date was before start date.")

        if self.status == "completed" and not self.end_date:
            raise ValidationError("Completed projects must have an valid end date.")

        if self.status != "completed" and self.end_date:
            raise ValidationError("Only completed projects can have an end date.")

    def __str__(self):
        return self.title