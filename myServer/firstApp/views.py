from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def getIndex(request):
    return render(request, "index.html")

    
def getContact(request):
    return render(request, "contact.html")

    
def getProjects(request):
    return render(request, "projects.html")

def getAbout(request):
    return render(request, "about.html")

    
def getAuthenticate(request):
    return render(request, "authenticate.html")

