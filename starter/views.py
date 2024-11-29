from django.shortcuts import render
import os
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

def startt(request):
    username = request.user.username
    return render (request , 'base.html' , {'username' : username})

def home(request):
    return render (request , 'home.html' , )


@login_required
def whiteb(request):
    return render (request , 'whiteb.html')



def test(request):
    return render (request , 'test.html')


def pdff(request):
    return render (request , 'pdff.html')

def art(request):
    return render (request , 'articles.html')