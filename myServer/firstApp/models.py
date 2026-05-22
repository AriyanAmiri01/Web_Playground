# Models interfaces
from django.db import models

# Validation tools
from django.core.exceptions import ValidationError

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    # Status Choices
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    title = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    tags = models.ManyToManyField(Tag)
    github_link = models.URLField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="planned"
    )
    

    def clean(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")
    
        if self.status == "completed" and not self.end_date:
            raise ValidationError("Completed projects must have an end date.")
    
        if self.status != "completed" and self.end_date:
            raise ValidationError("Only completed projects can have an end date.")

    def __str__(self):
        return self.title