from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from .forms import SignUpForm, UpdateUserForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .forms import PDFUploadForm
from .models import PDFUpload
from django.urls import reverse
@csrf_exempt
def login_page(request):
    if request.method == "POST" :
       data = request.POST
       user_name = data.get('username')
       passw = data.get('password')

       if  not User.objects.filter(username = user_name ).exists():
          messages.error(request , 'Invalid username')
          return redirect('/login')
       
       user = authenticate(username = user_name , password = passw)

       if user is None :
          messages.error(request , 'Invalid password')
          return redirect('/login')
       else:
          login(request , user)
          return redirect('home')
        


    return render(request , 'login.html') 

def logout_page(request):
   logout(request)
   return redirect('home')

def register_user(request):
    if request.method == "POST" :
       data = request.POST
       firstname = data.get('first_name')
       lastname = data.get('last_name')
       user_name = data.get('username')
       passw = data.get('password')

       user = User.objects.filter(username = user_name)

       if user.exists():
          messages.info(request, "Username already taken")
          return redirect('/register/')

       user = User.objects.create(
          first_name = firstname,
          last_name =  lastname,
          username = user_name
       )

       user.set_password(passw)
       user.save()

       messages.info(request, "Account created successfully")

       return redirect('login')
    return render(request , 'register.html') 



@login_required
def update_user(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            # Get the new data from the form
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')

            # Update the user's information
            current_user = request.user
            current_user.first_name = first_name
            current_user.last_name = last_name
            current_user.save()

            # Keep the user logged in and display a success message
            login(request, current_user)
            messages.success(request, "Profile updated successfully!")

            # Redirect to the homepage or any other page after update
            return redirect('home')

        # If GET request, show the current user's info in the form
        return render(request, 'update.html', {'user': request.user})
    else:
        messages.error(request, "You need to be logged in to update your profile.")
        return redirect('login')

def simulator(request):
    return render(request, 'simulator.html')

@login_required
def notes(request):
    return render(request, 'notes.html')

@login_required
def both(request):
    return render(request, 'both.html')

def upload_pdf(request):
        return render(request, 'pdff.html')

    