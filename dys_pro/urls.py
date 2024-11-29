"""
URL configuration for dys_pro project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from starter.views import *
from tts.views import *
from stt.views import *
from activities.views import *
from dashboard.views import *
from django.conf.urls.static import static

urlpatterns = [
    path('', startt , name = 'ini'),
    path('tts/',text_to_speech , name = 'tts'),
    path('pdff/',upload_pdf , name = 'pdff'),
    path('test/',test , name = 'test'),
    path('games/',games , name = 'games'),
    path('math/',math , name = 'math'),
    path('flc/', flc , name = 'flc'),
    path('progress/', user_progress, name='user-progress'),
    path('save_score/', save_score, name='save_score'),
    path('login/' , login_page  , name = 'login'),
    path('register/' , register_user  , name = 'register'),
    path('logout/' , logout_page , name = 'logout'),
    path('update/',update_user , name='update'),
    path('stt/',speech_to_text , name = 'stt'),
    path('transcribe/', transcribe_audio, name='transcribe_audio'),
    path('lsm' , lsm , name = 'lsm' ),
    path('rhyme' , rhyming_w , name = 'rhyme' ),
    path('home' , home , name ='home'),
    path('imageWo', imageW , name = 'imageWo'),
    path('numatch' , numatch , name = 'numatch'),
    path('notes' , notes , name = 'notes'),
    path('simulator' , simulator , name = 'simulator'),
    path('both' , both , name = 'both'),
    path('whiteb' , whiteb , name = 'whiteb'),
    path('article' , art , name = 'article'),
    path('admin/', admin.site.urls),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
