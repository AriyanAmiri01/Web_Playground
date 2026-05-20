from django.urls import path
from . import views


from django.contrib.auth.views import LoginView, LogoutView

from .views import register_view, home_view
urlpatterns = [
    path("", views.getIndex, name="index"),
    path("index/", views.getIndex, name="index"),
    path("about/", views.getAbout, name="about"),
    path("projects/", views.getProjects, name="projects"),
    path("contact/", views.getContact, name="contact"),
    path("user-profile/", views.getUserProf, name="user-profile"),
    #path("authenticate/", views.getAuthenticate, name="authenticate"),
    
    # dashboard URLs 
    path("admin-dashboard/", views.admin_dashboard, name="admin-dashboard"),
    path("client-dashboard/", views.client_dashboard, name="client-dashboard"),
    path("user-dashboard/", views.user_dashboard, name="user-dashboard"),

    #path("login/", views.getAuthenticate, name="authenticate"),
    path("login/", LoginView.as_view(template_name="authenticate.html"), name="login"),
    path("register/", register_view, name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
]