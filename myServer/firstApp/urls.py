from django.urls import path
from . import views

urlpatterns = [
    path("", views.getIndex, name="index"),
    path("index/", views.getIndex, name="index"),
    path("about/", views.getAbout, name="about"),
    path("projects/", views.getProjects, name="projects"),
    path("contact/", views.getContact, name="contact"),
    path("login/", views.getAuthenticate, name="authenticate"),
]