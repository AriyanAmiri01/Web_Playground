from django.urls import path
from . import views


from django.contrib.auth.views import LoginView, LogoutView


urlpatterns = [
    path("", views.getIndex, name="index"),
    path("index/", views.getIndex, name="index"),
    path("about/", views.getAbout, name="about"),
    path("projects/", views.getProjects, name="projects"),
    path("contact/", views.getContact, name="contact"),
    path("user-profile/", views.getUserProf, name="user-profile"),
    #path("authenticate/", views.getAuthenticate, name="authenticate"),
    
    path("api/projects/", views.project_list, name="project_list"),
    path("api/projects/create/", views.create_project, name="create_project"),
    path("api/projects/<int:project_id>/update/", views.update_project, name="update_project"),
    path("api/projects/<int:project_id>/delete/", views.delete_project, name="delete_project"),
    
    # dashboard URLs 
    path("admin-dashboard/", views.admin_dashboard, name="admin-dashboard"),
    path("client-dashboard/", views.client_dashboard, name="client-dashboard"),
    path("user-dashboard/", views.user_dashboard, name="user-dashboard"),
    path("login/", LoginView.as_view(template_name="authenticate.html"), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]