from django.shortcuts import render, reverse

from django.views import View

from django.contrib.auth import authenticate, login, logout

from django.http import HttpResponse, HttpResponseRedirect, Http404

from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token

from .models import ChattyUser

from Chat.models import ChattyUserSetting

from django.contrib.auth.mixins import LoginRequiredMixin

from django.core.mail import send_mail

# Fix Logout View

# Create your views here.

class RegisterView(View):

  def get(self, request):

    return render(request, 'Authentication/register.html')

  def post(self, request):

    display_name = request.POST['display_name']

    username = request.POST['username']

    email = request.POST['email']

    password = request.POST['password']

    date_created = request.POST['date_created']

    date_created = int(date_created)

    user = User.objects.create(username=username, email=email)

    user.set_password(password)

    user.save()

    token = Token.objects.create(user=user)

    chatty_user = ChattyUser(user=user, username=username, email=email, display_name=display_name, token=str(token), date_created=date_created, last_seen=date_created)

    chatty_user.save()

    chatty_user_setting = ChattyUserSetting.objects.create(chatty_user=chatty_user)

    n_user = authenticate(username=username, password=password)

    if n_user is not None:

      login(request, n_user)

      logged_in_user = User.objects.get(username=username)

      return HttpResponseRedirect(reverse('chat:home'))
    
    else:

      return render(request, 'Authentication/login.html', {})


class LoginView(View):

  def get(self, request):

    micra = {}

    if 'm_type' in request.session:

      micra = request.session['m_type']

      del request.session['m_type']

    return render(request, 'Authentication/login.html', micra)

  def post(self, request):

    username = request.POST['username']

    password = request.POST['password']

    user = authenticate(username=username, password=password)

    if user is not None:

      login(request, user)

      logged_in_user = User.objects.get(username=username)

      return HttpResponseRedirect(reverse('chat:home'))
    
    else:

      return render(request, 'Authentication/login.html', {'message': 'Invalid Password', 'm_type': 'bad'})


class LogoutView(LoginRequiredMixin, View):

  def get(self, request):

    logout(request)

    request.session['m_type'] = {'message': 'Logged out Successfully', 'm_type': 'good'}

    return HttpResponseRedirect(reverse('authviews:login'))


class CreateNewPassword(View):
  
  def get(self, request):

    return render(request, 'Authentication/create_new_password.html')

  def post(self, request):

    username = request.POST['username']

    user = User.objects.get(username=username)

    password = User.objects.make_random_password()

    try:

      send_mail('Chatty Account Password Reset', f'Hello {user.username}, \n\n\tYour new password is {password}, be sure to change it after logging in. Thanks for working with us, \n\n Chatty', 
        'elpis409@gmail.com', [user.email], fail_silently=False)

      user.set_password(password)

      user.save()

      context = {'message': 'Email Sent Successfully', 'm_type': 'good'}

    except:

      context = {'message': 'There seemes to be a problem', 'm_type': 'bad'}
      

    return render(request, 'Authentication/create_new_password.html', context=context)
