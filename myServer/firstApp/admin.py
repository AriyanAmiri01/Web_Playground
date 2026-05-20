from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Tag, Project

admin.site.register(Tag)
admin.site.register(Project)