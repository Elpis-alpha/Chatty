import time

from django.shortcuts import render, reverse

from django.views import View

from django.contrib.auth.mixins import LoginRequiredMixin

from django.contrib.auth.models import User

from django.http import HttpResponseRedirect

from rest_framework.authtoken.models import Token

from Authentication.models import ChattyUser

from Chat.models import ChattyGroup

from Chat.models import ChattyGroupSetting

from Chat.models import ChattyUserSetting

from Chat.models import Acquaintance

from Chat.models import Message

from Chat.models import ChattyUserNotification

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

# Create your views here.


class HomeView(LoginRequiredMixin, View):

  def get(self, request):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    return render(request, 'Chat/home.html', {'chatty_user': chatty_user})


class ChattySettingsView(LoginRequiredMixin, View):

  def get(self, request):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    chatty_settings = ChattyUserSetting.objects.get(chatty_user=chatty_user)

    context = {
        'chatty_user': chatty_user,
        'chatty_settings': chatty_settings,
    }

    return render(request, 'Chat/chatty_settings.html', context=context)

  def post(self, request):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    chatty_settings = ChattyUserSetting.objects.get(chatty_user=chatty_user)

    layer = get_channel_layer()

    for chatty_group in ChattyGroup.objects.all().filter(group_members__id=chatty_user.id):

      for member in chatty_group.group_members.all():

        if member.username != chatty_user.username:

          async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
            'to': member.username,
            'type': 'notification',
          }})

          ChattyUserNotification.objects.create(

            name='Message', chatty_user=member, header=chatty_user.display_name, 

            content=f'{chatty_user.display_name} has left Chatty', 

            date_sent=int(time.time()*1000), detail=f"Nil")

      if chatty_group.is_dialogue:

        chatty_group.delete()

      elif chatty_group.group_members.count() < 2:

        chatty_group.delete()

    request.user.delete()

    return HttpResponseRedirect(reverse('authviews:register'))


class DialogueView(LoginRequiredMixin, View):

  def get(self, request, recipient):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    other_user = ChattyUser.objects.get(user=User.objects.get(username=recipient))

    if other_user.username == chatty_user.username:

      return HttpResponseRedirect(reverse('chat:home'))

    else:

      context = {
          'chatty_user': chatty_user,
          'other_user': other_user,
      }

      return render(request, 'Chat/dialogue.html', context=context)


class UserDetailView(LoginRequiredMixin, View):

  def get(self, request, recipient):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    other_user = ChattyUser.objects.get(user=User.objects.get(username=recipient))

    context = {
        'chatty_user': chatty_user,
        'other_user': other_user,
    }

    return render(request, 'Chat/user_detail.html', context=context)


class GroupView(LoginRequiredMixin, View):

  def get(self, request, name):

    try:

      chatty_user = ChattyUser.objects.get(user=request.user)

      chatty_user.last_seen = int(time.time()*1000)

      chatty_user.save()

      chatty_group = ChattyGroup.objects.get(name=name)

      context = {
          'chatty_user': chatty_user,
          'chatty_group': chatty_group,
      }

      if chatty_group.group_members.all().filter(user=chatty_user.user).exists():

        return render(request, 'Chat/group.html', context=context)

      else:

        return HttpResponseRedirect(reverse('chat:home'))

    except ChattyGroup.DoesNotExist:

      return HttpResponseRedirect(reverse('chat:home'))


class GroupDetailView(LoginRequiredMixin, View):

  def get(self, request, name):

    try:

      chatty_user = ChattyUser.objects.get(user=request.user)

      chatty_user.last_seen = int(time.time()*1000)

      chatty_user.save()

      chatty_group = ChattyGroup.objects.get(name=name)

      context = {
          'chatty_user': chatty_user,
          'chatty_group': chatty_group,
      }

      if chatty_group.group_members.all().filter(user=chatty_user.user).exists():

        return render(request, 'Chat/group_detail.html', context=context)

      else:

        return HttpResponseRedirect(reverse('chat:home'))

    except ChattyGroup.DoesNotExist:

      return HttpResponseRedirect(reverse('chat:home'))


class GroupSettingsView(LoginRequiredMixin, View):

  def get(self, request, name):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    chatty_group = ChattyGroup.objects.get(name=name)

    context = {
        'chatty_user': chatty_user,
        'chatty_group': chatty_group,
    }

    if chatty_group.group_admin.all().filter(user=chatty_user.user).exists():

      return render(request, 'Chat/group_settings.html', context=context)

    else:

      return HttpResponseRedirect(reverse('chat:chatty-settings'))

  def post(self, request, name):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    chatty_group = ChattyGroup.objects.get(name=name)

    if chatty_group.group_admin.all().filter(user=chatty_user.user).exists():

      layer = get_channel_layer()

      for member in chatty_group.group_members.all():

        async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
          'to': member.username,
          'from': chatty_user.username,
          'type': 'notification',
        }})

        ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_group.group_name, content=f'{chatty_user.display_name} has deleted the group', date_sent=int(time.time()*1000), detail=f"Nil")

      chatty_group.delete()

      return HttpResponseRedirect(reverse('chat:home'))

    else:

      return HttpResponseRedirect(reverse('chat:home'))


class NewGroupView(LoginRequiredMixin, View):

  def get(self, request):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    return render(request, 'Chat/new_group.html', context={'chatty_user': chatty_user})

  def post(self, request):

    chatty_user = ChattyUser.objects.get(user=request.user)

    chatty_user.last_seen = int(time.time()*1000)

    chatty_user.save()

    chatty_group = ChattyGroup(

        date_created=int(request.POST['date_created']),

        group_name=request.POST['group_name'],

        group_description=request.POST['description'],

        is_dialogue=False
    )

    chatty_group.save()

    try:

      chatty_group.group_image = request.FILES['group_image']

    except:

      pass

    chatty_group.save()

    chatty_group.group_admin.add(chatty_user)

    chatty_group.group_members.add(chatty_user)

    chatty_group.save()

    ChattyGroupSetting.objects.create(
        group=chatty_group,
        chatty_user=chatty_user,
        muted=False,
        pinned=False,
        date_joined=request.POST['date_created']
    )

    Message.objects.create(group=chatty_group, date_created=request.POST['date_created'], message_type='Text', sender=chatty_user, message=f'Group created by {chatty_user.display_name}')

    ChattyUserNotification.objects.create(name='Message', chatty_user=chatty_user, header=chatty_group.group_name, content=f'You created {chatty_group.group_name}', date_sent=request.POST['date_created'], detail=f"Group:{chatty_group.name}")

    group_name = chatty_group.name

    return HttpResponseRedirect(reverse('chat:group', kwargs={'name': group_name}))


class JoinGroupView(LoginRequiredMixin, View):

  def get(self, request, group, join_key):

    try:

      chatty_user = ChattyUser.objects.get(user=request.user)

      chatty_user.last_seen = int(time.time()*1000)

      chatty_user.save()

      chatty_group = ChattyGroup.objects.get(name=group)

      if chatty_group.secret_key_join == join_key:

        chatty_group.group_members.add(chatty_user)

        chatty_group.save()

        ChattyGroupSetting.objects.create(group=chatty_group, chatty_user=chatty_user, muted=False, pinned=False, date_joined=int(time.time()*1000))

        message = Message.objects.create(group=chatty_group, date_created=int(time.time()*1000), message_type='Text', sender=chatty_user, message=f'{chatty_user.display_name} joined the group')

        layer = get_channel_layer()

        for member in chatty_group.group_members.all():

          async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
            'to': member.username,
            'toGroup': chatty_group.name,
            'from': chatty_user.username,
            'type': 'add-message',
            'id': message.id
          }})

          ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_group.group_name, content=f'{chatty_user.display_name} has joined the group', date_sent=int(time.time()*1000), detail=f"Group:{chatty_group.name}")

        return HttpResponseRedirect(reverse('chat:group', kwargs={'name': group}))

      else:

        return HttpResponseRedirect(reverse('chat:home'))

    except ChattyGroup.DoesNotExist:

      return HttpResponseRedirect(reverse('chat:home'))


class AdminGroupView(LoginRequiredMixin, View):

  def get(self, request, group, join_key):

    try:

      chatty_user = ChattyUser.objects.get(user=request.user)

      chatty_user.last_seen = int(time.time()*1000)

      chatty_user.save()

      chatty_group = ChattyGroup.objects.get(name=group)

      if chatty_group.secret_key_admin == join_key:

        chatty_group.group_members.add(chatty_user)

        chatty_group.group_admin.add(chatty_user)

        chatty_group.save()

        message = Message.objects.create(group=chatty_group, date_created=int(time.time()*1000), message_type='Text', sender=chatty_user, message=f'{chatty_user.display_name} is now an admin')

        layer = get_channel_layer()

        for member in chatty_group.group_members.all():

          async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
            'to': member.username,
            'toGroup': chatty_group.name,
            'from': chatty_user.username,
            'type': 'add-message',
            'id': message.id
          }})

          ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_group.group_name, content=f'{chatty_user.display_name} is now an admin', date_sent=int(time.time()*1000), detail=f"Group:{chatty_group.name}")

        return HttpResponseRedirect(reverse('chat:group', kwargs={'name': group}))

      else:

        return HttpResponseRedirect(reverse('chat:home'))

    except ChattyGroup.DoesNotExist:

      return HttpResponseRedirect(reverse('chat:home'))
