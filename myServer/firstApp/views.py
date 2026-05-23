# rendering
from django.shortcuts import render

# test response
from django.http import HttpResponse


# For authentication
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required

# For roles and their permission
from django.contrib.auth.decorators import login_required, user_passes_test
from .roles import is_admin, is_client, is_user
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required

from .forms import RegisterForm
from django.db.models import Q

# for item handling
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Project
from .models import Project, Tag, ProjectLike



# GET requests
def getIndex(request):
    return render(request, "index.html")
 
def getContact(request):
    return render(request, "contact.html")

def getProjects(request):
    return render(request, "projects.html")

def getAbout(request):
    return render(request, "about.html")

def getUserProf(request):
    return render(request, "user-profile.html")

def getAuthenticate(request):
    return render(request, "authenticate.html")


# Dashbaord GETS
@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    return render(request, "admin-dashboard.html")

@login_required
@user_passes_test(is_client)
def client_dashboard(request):
    return render(request, "client-dashboard.html")

@login_required
@user_passes_test(is_user)
def user_dashboard(request):
    return render(request, "user-dashboard.html")


#  Admin Project management
def project_list(request):
    # Get projects in order of their start date
    projects = Project.objects.all()

    # Extract search parameter from http request
    search = request.GET.get("search")
    category = request.GET.get("category")
    sort = request.GET.get("sort", "newest")

    # Apply the search filter
    if search:
        projects = projects.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(tags__name__icontains=search)
        ).distinct()

    # Apply the category filter
    if category:
        projects = projects.filter(category=category)

    # Apply the sorting filter
    if sort == "newest":
        projects = projects.order_by("-start_date")
    elif sort == "oldest":
        projects = projects.order_by("start_date")
    elif sort == "az":
        projects = projects.order_by("title")
    else:
        projects = projects.order_by("-start_date")

    # preparing the json response
    data = []
    for project in projects:
        data.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "tags": [tag.name for tag in project.tags.all()],
            "github_link": project.github_link,
            "start_date": project.start_date.isoformat(),
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "status": project.status,
            "likes_count": project.likes.count(),
            "liked_by_user": (
                request.user.is_authenticated and
                project.likes.filter(user=request.user).exists()
            ),
        })

    # sending json response to the client
    return JsonResponse({"projects": data})
    

@require_http_methods(["POST"])
@permission_required('firstapp.add_project')
@permission_required('firstapp.add_tag')
def create_project(request):
    # Get the new item json data
    data = json.loads(request.body)

    # Create the project object
    project = Project.objects.create(
        title=data.get("title", ""),
        description=data.get("description", ""),
        github_link=data.get("github_link", ""),
        start_date=data.get("start_date"),
        end_date=data.get("end_date") or None,
        status=data.get("status", "planned"),
    )

    # Handle tags separately because tags is ManyToManyField
    tag_text = data.get("tags", "")
    tag_names = [
        tag.strip()
        for tag in tag_text.split(",")
        if tag.strip()
    ]
    for tag_name in tag_names:
        tag, created = Tag.objects.get_or_create(
            name=tag_name
        )
        project.tags.add(tag)

    # Return JSON response
    return JsonResponse({
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "tags": [
            tag.name
            for tag in project.tags.all()
        ],
        "github_link": project.github_link,
        "start_date": project.start_date,
        "end_date": project.end_date,
        "status": project.status,
    })

@login_required
@require_http_methods(["POST"])
@permission_required('firstapp.change_project')
@permission_required('firstapp.change_tag')
def update_project(request, project_id):
    try:
        data = json.loads(request.body)
        project = Project.objects.get(id=project_id)

        if "title" in data:
            project.title = data["title"]

        if "description" in data:
            project.description = data["description"]

        if "github_link" in data:
            project.github_link = data["github_link"]

        if "start_date" in data:
            project.start_date = data["start_date"]

        if "end_date" in data:
            project.end_date = data["end_date"] or None

        if "status" in data:
            project.status = data["status"]

        project.save()

        if "tags" in data:
            project.tags.clear()

            tag_names = [
                tag.strip()
                for tag in data["tags"].split(",")
                if tag.strip()
            ]

            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                project.tags.add(tag)

        return JsonResponse({"success": True})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@require_http_methods(["POST"])
@permission_required('firstapp.delete_project')
@permission_required('firstapp.delete_tag')
def delete_project(request, project_id):
    project = Project.objects.get(id=project_id)
    project.delete()

    return JsonResponse({"success": True})




from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required


@login_required
@permission_required('firstapp.change_project')
@permission_required('firstapp.change_project')
def toggle_project_like(request, project_id):
    print("toggle_project is called")

    project = get_object_or_404(Project, id=project_id)

    like, created = ProjectLike.objects.get_or_create(
        project=project,
        user=request.user
    )

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    return JsonResponse({
        "liked": liked,
        "likes_count": project.likes.count()
    })