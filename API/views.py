import time

from django.shortcuts import render

from Authentication.models import ChattyUser

from .serializers import ChattyUserSerializer

from .serializers import ChattyGroupSerializer

from .serializers import MessageSerializer

from .serializers import ChattyUserNotificationSerializer

from django.contrib.auth.models import User

from django.http import Http404

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework import status

from Chat.models import ChattyGroup

from Chat.models import ChattyGroupSetting

from Chat.models import Acquaintance

from Chat.models import ChattyUserSetting

from Chat.models import ChattyUserNotification

from Chat.models import Message

from django.core.files import File

from rest_framework.parsers import JSONParser

from rest_framework.parsers import MultiPartParser

from django.contrib.auth import authenticate, login, logout

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

from django.db.models import Exists

from django.db.models import OuterRef

from itertools import chain


class ChattyUserList(APIView):

  def get(self, request, format=None):

    chatty_users = ChattyUser.objects.all()

    serializer = ChattyUserSerializer(chatty_users, many=True)

    return Response(serializer.data)


class ChattyUserByID(APIView):

  def get_object_by_id(self, id):

    try:

      return ChattyUser.objects.get(id=id)

    except ChattyUser.DoesNotExist:

      pass

  def get(self, request, id, format=None):

    chatty_user = self.get_object_by_id(id)

    serializer = ChattyUserSerializer(chatty_user)

    return Response(serializer.data)


class ChattyUserByUsername(APIView):

  parser_classes = [JSONParser, MultiPartParser]

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def get_object_by_username(self, username):

    try:

      return ChattyUser.objects.get(username=username)

    except ChattyUser.DoesNotExist:

      pass

  def get(self, request, username, format=None):

    chatty_user = self.get_object_by_username(username)

    serializer = ChattyUserSerializer(chatty_user)

    return Response(serializer.data)

  def put(self, request, username, format=None):

    if self.is_validated(request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      if request.data['with_image'] == 'true':

        chatty_user.picture.delete()

        chatty_user.picture = request.FILES['image']

      if request.data['with_image'] == 'truex':

        chatty_user.picture.delete()

        chatty_user.picture = None

      if request.data['with_name'] == 'true':

        chatty_user.display_name = request.data['display_name']

      if request.data['with_bio'] == 'true':

        chatty_user.biography = request.data['biography']

      if request.data['with_password'] == 'true':

        if chatty_user.user.check_password(request.data['old_password']):

          chatty_user.user.set_password(request.data['new_password'])

          chatty_user.user.save()

          user = authenticate(username=chatty_user.user.username, password=request.data['new_password'])

          login(request, user)

      if request.data['with_phone'] == 'true':

        chatty_user.number = request.data['phone']

      chatty_user.save()

      layer = get_channel_layer()

      for chatty_group in ChattyGroup.objects.all().filter(group_members__id=chatty_user.id, is_dialogue=True):

        for member in chatty_group.group_members.all():

          if member.username != chatty_user.username:

            async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
                'to': member.username,
                'from': chatty_user.username,
                'type': 'profile-update',
            }})

            ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_user.display_name,
                                                  content=f'{chatty_user.display_name} has updated his/her profile', date_sent=int(time.time()*1000), detail=f"Dialogue:{chatty_user.username}")

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class ChattyUserByEmail(APIView):

  def get_object_by_email(self, email):

    try:

      return ChattyUser.objects.get(email=email)

    except ChattyUser.DoesNotExist:

      pass

  def get(self, request, email, format=None):

    chatty_user = self.get_object_by_email(email)

    serializer = ChattyUserSerializer(chatty_user)

    return Response(serializer.data)


class ChattyGroupList(APIView):

  def get(self, request, format=None):

    chatty_groups = ChattyGroup.objects.all()

    serializer = ChattyGroupSerializer(chatty_groups, many=True)

    return Response(serializer.data)

  def post(self, request, format=None):

    info = request.data

    try:

      if info['is_dialogue'] == True:

        new_group = ChattyGroup(date_created=info['date_created'], is_dialogue=True)

        new_group.save()

        new_group.group_members.add(*info['members'])

        new_group.save()

        chatty_user = ChattyUser.objects.get(id=info['members'][0])

        messag = Message.objects.create(group=new_group, date_created=int(time.time()*1000), message_type='Text', sender=chatty_user, message='Dialogue with')

        for membs in info['members']:

          user = ChattyUser.objects.get(id=int(membs))

          ChattyGroupSetting.objects.create(group=new_group, chatty_user=user, muted=False, pinned=False, date_joined=info['date_created'])

        layer = get_channel_layer()

        for member in new_group.group_members.all():

          if member.username != chatty_user.username:

            async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
                'to': member.username,
                'from': chatty_user.username,
                'type': 'new-dialogue',
            }})

            ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_user.display_name,
                                                  content=f'{chatty_user.display_name} has engaged you in a dialogue', date_sent=int(time.time()*1000), detail=f"Dialogue:{chatty_user.username}")

        return Response({'msg': 'Dialogue', 'data': new_group.name})

      else:

        return Response({'msg': 'Bitches'})

    except Exception as e:

      return Response({'errors': str(e)})


class ChattyGroupHomeList(APIView):

  def get_all_associated_groups(self, token):

    chatty_user = ChattyUser.objects.get(token=token)

    chatty_groups = ChattyGroup.objects.all().filter(group_members__id=chatty_user.id)

    acquaintances = Acquaintance.objects.all().filter(chatty_user=chatty_user)

    returnList = []

    for group in chatty_groups:

      item = {
          'is_dialogue': group.is_dialogue,
          'group': group
      }

      if group.is_dialogue:

        other_user = group.group_members.all().exclude(username=chatty_user.username).values()[0]

        item['is_acquaintance'] = False

        item['display_name'] = other_user['display_name']

        for x in acquaintances:

          if x.user_acquaintance.username == other_user['username']:

            item['is_acquaintance'] = True

            item['display_name'] = x.name

      item['last_message'] = Message.objects.all().filter(group=group).order_by('-date_created')[:1][0]

      returnList.append(item)

    return returnList

  def post(self, request, format=None):

    info = request.data

    try:

      newData = self.get_all_associated_groups(info['token'])

      return Response(newData)

    except Exception as e:

      return Response({'errors': str(e)})


class ChattyGroupByName(APIView):

  parser_classes = [JSONParser, MultiPartParser]

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      group = ChattyGroup.objects.get(name=group)

      if group.group_admin.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def get_object_by_name(self, name):

    try:

      return ChattyGroup.objects.get(name=name)

    except ChattyGroup.DoesNotExist:

      pass

  def get(self, request, name, format=None):

    chatty_group = self.get_object_by_name(name)

    serializer = ChattyGroupSerializer(chatty_group)

    return Response(serializer.data)

  def put(self, request, name, format=None):

    group = ChattyGroup.objects.get(name=name)

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      if request.data['with_image'] == 'true':

        group.group_image.delete()

        group.group_image = request.FILES['image']

      if request.data['with_image'] == 'truex':

        group.group_image.delete()

        group.group_image = None

      if request.data['with_name'] == 'true':

        group.group_name = request.data['group_name']

      if request.data['with_des'] == 'true':

        group.group_description = request.data['group_description']

      group.save()

      layer = get_channel_layer()

      for member in group.group_members.all():

        if member.username != chatty_user.username:

          async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
              'to': member.username,
              'from': chatty_user.username,
              'type': 'profile-update',
          }})

          ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=group.group_name,
                                                content=f'{chatty_user.display_name} has edited the group', date_sent=int(time.time()*1000), detail=f"Group:{group.name}")

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class IsDialogue(APIView):

  def is_dia(self, user, other):

    chatty_user = ChattyUser.objects.get(username=user).id

    other_user = ChattyUser.objects.get(username=other).id

    chatty_groups = ChattyGroup.objects.all().filter(group_members__id=chatty_user, is_dialogue=True).filter(group_members__id=other_user)

    if len(chatty_groups) == 0:

      return [False]

    else:

      return [True, chatty_groups[0].name]

  def get(self, request, user, other, format=None):

    x = self.is_dia(user, other)

    if x[0]:

      return Response({'msg': True, 'name': x[1]})

    else:

      return Response({'msg': False})


class IsAcquaintance(APIView):

  def is_acq(self, user, other):

    chatty_user = ChattyUser.objects.get(username=user).id

    other_user = ChattyUser.objects.get(username=other).id

    chatty_groups = ChattyGroup.objects.all().filter(group_members__id=chatty_user, is_dialogue=True).filter(group_members__id=other_user)

    acq = Acquaintance.objects.all().filter(group=chatty_groups[0], chatty_user=chatty_user, user_acquaintance=other_user)

    if len(acq) == 0:

      return [False]

    else:

      return [True, acq[0].name]

  def get(self, request, user, other, format=None):

    x = self.is_acq(user, other)

    if x[0]:

      return Response({'msg': True, 'name': x[1]})

    else:

      return Response({'msg': False})


class MessageByGroup(APIView):

  def get_message_by_group(self, group, start, end):

    group = ChattyGroup.objects.get(name=group)

    if end == 'latest':

      message = Message.objects.all().filter(group=group).order_by('-date_created')[:int(start)]

    else:

      message = Message.objects.all().filter(group=group).order_by('-date_created')[int(end):int(start)]

    return message

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      group = ChattyGroup.objects.get(name=group)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, group, start, end, format=None):

    if self.is_validated(group, request.data['token']):

      messages = self.get_message_by_group(group, start, end)

      serializer = MessageSerializer(messages, many=True)

      return Response(serializer.data)

    else:

      return Response({'msg': 'Validation Failed'})


class MessageByID(APIView):

  def get_message_by_id(self, id):

    try:

      message = Message.objects.get(id=id)

      return message

    except:

      raise Http404()

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, id, format=None):

    message = self.get_message_by_id(id)

    group = message.group

    if self.is_validated(group, request.data['token']):

      serializer = MessageSerializer(message)

      return Response(serializer.data)

    else:

      return Response({'msg': 'Validation Failed'})

  def put(self, request, id, format=None):

    message = self.get_message_by_id(id)

    group = message.group

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      if request.data['type'] == 'date_received':

        message.date_received = request.data['date_received']

        message.save()

        return Response({'msg': 'Date Created Successfully Added'})

      if request.data['type'] == 'delete':

        for mes_ref in message.message_to.all():

          if mes_ref.message_type == 'Text with Refferal':

            mes_ref.message_type = 'Pure Text'

          if mes_ref.message_type == 'Image with Refferal':

            mes_ref.message_type = 'Image with Caption'

          if mes_ref.message_type == 'File with Refferal':

            mes_ref.message_type = 'File with Caption'

          mes_ref.save()

        xid = message.id

        message.other_file.delete()

        message.image.delete()

        message.delete()

        layer = get_channel_layer()

        for member in group.group_members.all():

          if member.username != chatty_user.username:

            ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=group.group_name,
                                                  content=f'{chatty_user.display_name} has deleted a message in the group', date_sent=int(time.time()*1000), detail=f"Group:{group.name}")

        return Response({'msg': 'Message Deleted', 'messageID': xid})

      else:

        return Response({'msg': 'Type not specified'})

    else:

      return Response({'msg': 'Validation Failed'})


class MessageByGroupLast(APIView):

  def get_last_message(self, group):

    try:

      message = Message.objects.all().filter(group=group).exclude(message_type='Text').order_by('-date_created')[:1]

      try:

        message = message[0]

        message = {'message': message.message, 'date_created': message.date_created, 'date_received': message.date_received, 'sender_id': message.sender.id}

      except IndexError:

        message = {'message': 'No Message', 'date_created': group.date_created}

      return message

    except:

      raise Http404()

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    group = ChattyGroup.objects.get(name=request.data['name'])

    if self.is_validated(group, request.data['token']):

      message = self.get_last_message(group)

      return Response(message)

    else:

      return Response({'msg': 'Validation Failed'})


class AllMessagePost(APIView):

  parser_classes = [JSONParser, MultiPartParser]

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    info = request.data

    group = ChattyGroup.objects.get(id=info['group'])

    if self.is_validated(group, info['token']):

      layer = get_channel_layer()

      try:

        msg = ''

        if info['msgType'] == 'Pure Text':

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              message_type=info['msgType'],

              sender=chatty_user,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'Blank Message'

        elif info['msgType'] == 'Image with Caption':

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              image=request.FILES['image'],

              message_type=info['msgType'],

              sender=chatty_user,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'Image'

        elif info['msgType'] == 'File with Caption':

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              other_file=request.FILES['file'],

              message_type=info['msgType'],

              sender=chatty_user,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'File'

        elif info['msgType'] == 'Text with Refferal':

          ref_message = Message.objects.get(id=int(info['messageRef']))

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              message_refer=ref_message,

              date_created=info['dateCreated'],

              pinned=False,

              message_type=info['msgType'],

              sender=chatty_user,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'Blank Message'

        elif info['msgType'] == 'Image with Refferal':

          ref_message = Message.objects.get(id=int(info['messageRef']))

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              image=request.FILES['image'],

              message_type=info['msgType'],

              sender=chatty_user,

              message_refer=ref_message,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'Image'

        elif info['msgType'] == 'File with Refferal':

          ref_message = Message.objects.get(id=int(info['messageRef']))

          chatty_user = ChattyUser.objects.get(id=int(info['sender']))

          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              other_file=request.FILES['file'],

              message_refer=ref_message,

              message_type=info['msgType'],

              sender=chatty_user,

              message=info['message']
          )

          msg = message.message

          if msg == '' or msg == None:
            msg = 'File'

        else:

          """
          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              message_type=info['msgType'],

              sender=int(info['sender']),

              message_refer=int(info['messageRef']),

              message=info['message']
          )
          """

          pass

        for member in group.group_members.all():

          if member.username != chatty_user.username:

            if group.is_dialogue:

              ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_user.display_name,
                                                    content=f'{msg}', date_sent=int(time.time()*1000), detail=f"Dialogue:{chatty_user.username}")

            else:

              ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=group.group_name,
                                                    content=f'{chatty_user.display_name}: {msg}', date_sent=int(time.time()*1000), detail=f"Group:{group.name}")

        return Response({'msg': 'Message Created', 'messageID': message.id})

      except Exception as e:

        return Response({'errors': e.__str__()})

    else:

      return Response({'msg': 'Validation Failed'})


class GroupLinkActivities(APIView):

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_admin.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    info = request.data

    group = ChattyGroup.objects.get(id=info['group'])

    if self.is_validated(group, info['token']):

      try:

        if info['request'] == 'Request Admin':

          returnValue = group.secret_key_admin

        elif info['request'] == 'Generate Admin':

          group.secret_key_admin = str(group.pk) + '-' + User.objects.make_random_password() + User.objects.make_random_password() + User.objects.make_random_password()

          group.save()

          returnValue = group.secret_key_admin

        elif info['request'] == 'Request Join':

          returnValue = group.secret_key_join

        elif info['request'] == 'Generate Join':

          group.secret_key_join = str(group.pk) + '-' + User.objects.make_random_password() + User.objects.make_random_password() + User.objects.make_random_password()

          group.save()

          returnValue = group.secret_key_join

        else:

          """
          message = Message.objects.create(
              group=group,

              date_created=info['dateCreated'],

              pinned=False,

              message_type=info['msgType'],

              sender=int(info['sender']),

              message_refer=int(info['messageRef']),

              message=info['message']
          )
          """

          pass

        return Response({'msg': 'Token', 'token': returnValue})

      except Exception as e:

        return Response({'errors': e.__str__()})

    else:

      return Response({'msg': 'Validation Failed'})


class GroupSettings(APIView):

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    group = ChattyGroup.objects.get(name=request.data['name'])

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      group_settings = ChattyGroupSetting.objects.get(group=group, chatty_user=chatty_user)

      return Response({'msg': 'Successful', 'setting': {
          'pinned': group_settings.pinned,
          'muted': group_settings.muted,
          'date_joined': group_settings.date_joined,
      }})

    else:

      return Response({'msg': 'Validation Failed'})

  def put(self, request, format=None):

    group = ChattyGroup.objects.get(name=request.data['name'])

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      group_settings = ChattyGroupSetting.objects.get(group=group, chatty_user=chatty_user)

      group_settings.pinned = request.data['pinned']

      group_settings.muted = request.data['muted']

      group_settings.save()

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class ChattyUserSettings(APIView):

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def post(self, request, format=None):

    if self.is_validated(request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      chatty_settings = ChattyUserSetting.objects.get(chatty_user=chatty_user)

      return Response({'msg': 'Successful', 'setting': {
          'send_by_enter': chatty_settings.send_by_enter,
          'counter': chatty_settings.counter,
      }})

    else:

      return Response({'msg': 'Validation Failed'})

  def put(self, request, format=None):

    if self.is_validated(request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      chatty_settings = ChattyUserSetting.objects.get(chatty_user=chatty_user)

      chatty_settings.send_by_enter = request.data['send_by_enter']

      chatty_settings.counter = request.data['counter']

      chatty_settings.save()

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class AllGroupsByUser(APIView):

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def post(self, request, format=None):

    info = request.data

    if self.is_validated(info['token']):

      chatty_user = ChattyUser.objects.get(token=info['token'])

      chatty_groups = ChattyGroup.objects.all().filter(group_members__id=chatty_user.id).values()

      chatty_groups = list(chatty_groups)

      for group in chatty_groups:

        last_message = Message.objects.all().filter(group=group['id']).order_by('-date_created')[:1].values()

        group_settings = ChattyGroupSetting.objects.get(group=group['id'], chatty_user=chatty_user)

        group['secret_key_join'] = None

        group['secret_key_admin'] = None

        group['pinned'] = group_settings.pinned

        try:
          group['last_message'] = last_message[0]

        except IndexError:
          group['last_message'] = {'message': 'No Message', 'date_created': group['date_created']}

        if group['is_dialogue']:

          acquaintance = Acquaintance.objects.filter(chatty_user=chatty_user, group=group['id']).exists()

          other_user = ChattyGroup.objects.get(id=group['id']).group_members.exclude(username=chatty_user.username).values()[0]

          group['other_user'] = other_user['username']

          group['other_user_name'] = other_user['display_name']

          group['other_user_picture'] = other_user['picture']

          if acquaintance:

            group['is_acq'] = True

            group['other_user_name'] = Acquaintance.objects.get(chatty_user=chatty_user, group=group['id']).name

          else:

            group['is_acq'] = False

        group['token'] = None

      def sort_groups(group):

        return int(group['last_message']['date_created'])

      chatty_groups = list(chatty_groups)

      chatty_groups.sort(key=sort_groups, reverse=True)

      return Response({'msg': 'Successful', 'groups': chatty_groups})

    else:

      return Response({'msg': 'Validation Failed'})


class Notification(APIView):

  parser_classes = [JSONParser, MultiPartParser]

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def post(self, request, format=None):

    if self.is_validated(request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      start = int(request.data['start'])

      stop = int(request.data['stop'])

      notifications = ChattyUserNotification.objects.filter(chatty_user=chatty_user).order_by('-date_sent')[start:stop]

      serializer = ChattyUserNotificationSerializer(notifications, many=True)

      return Response(serializer.data)


class LeaveGroup(APIView):

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    group = ChattyGroup.objects.get(name=request.data['group'])

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      layer = get_channel_layer()

      for member in group.group_members.all():

        async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
            'to': member.username,
            'from': chatty_user.username,
            'type': 'leave-group',
        }})

        if member.username != chatty_user.username:

          ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=group.group_name,
                                                content=f'{chatty_user.display_name} has left the group', date_sent=int(time.time()*1000), detail=f"Nil")

      Message.objects.create(group=group, message_type="Text", date_created=int(time.time()*1000), sender=chatty_user, message=f"{chatty_user.display_name} has left the group")

      group.group_members.remove(chatty_user)

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class deleteDialogue(APIView):

  def is_validated(self, group, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      if group.group_members.all().filter(user=chatty_user.user).exists():

        return True

      else:

        return False

    except:

      return False

  def post(self, request, format=None):

    group = ChattyGroup.objects.get(name=request.data['group'], is_dialogue=True)

    if self.is_validated(group, request.data['token']):

      chatty_user = ChattyUser.objects.get(token=request.data['token'])

      layer = get_channel_layer()

      for member in group.group_members.all():

        async_to_sync(layer.group_send)(f'message_to_{member.username}', {'type': 'chatty_user_message', 'message': {
            'to': member.username,
            'from': chatty_user.username,
            'type': 'delete-dialogue',
        }})

        if member.username != chatty_user.username:

          ChattyUserNotification.objects.create(name='Message', chatty_user=member, header=chatty_user,
                                                content=f'{chatty_user.display_name} has deleted your dialogue', date_sent=int(time.time()*1000), detail=f"Nil")

      group.delete()

      return Response({'msg': 'Successful'})

    else:

      return Response({'msg': 'Validation Failed'})


class GetRandomDialogues(APIView):

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def post(self, request, format=None):

    info = request.data

    if self.is_validated(info['token']):

      chatty_user = ChattyUser.objects.get(token=info['token'])

      other_users = ChattyUser.objects.exclude(username=chatty_user.username).filter(~Exists(ChattyGroup.objects.filter(
          group_members__id=OuterRef('pk')).filter(group_members__id=chatty_user.pk))).order_by('-last_seen')[:info['number']]

      groupx = []

      for user in other_users:

        group = {}

        group['last_message'] = 'No Message'

        group['last_seen'] = user.last_seen

        group['id'] = user.id

        group['other_user'] = user.username

        group['other_user_name'] = user.display_name

        if user.picture.name:

          group['other_user_picture'] = user.picture.name

        groupx.append(group)

      return Response({'msg': 'Successful', 'groups': groupx})

    else:

      return Response({'msg': 'Validation Failed'})


class SearchAll(APIView):

  def is_validated(self, token):

    try:

      chatty_user = ChattyUser.objects.get(token=token)

      return True

    except:

      return False

  def post(self, request, format=None):

    info = request.data

    if self.is_validated(info['token']):

      chatty_user = ChattyUser.objects.get(token=info['token'])

      search_word = info['searchWord']

      q1 = chatty_user.members.filter(is_dialogue=False, group_name__iexact=search_word)

      q2 = ChattyGroup.objects.filter( is_dialogue=True,group_members__in=ChattyUser.objects.filter(display_name__iexact=search_word)).filter(group_members=chatty_user)

      q3 = ChattyGroup.objects.filter( is_dialogue=True,group_members__in=ChattyUser.objects.filter(username__iexact=search_word)).filter(group_members=chatty_user).exclude(id__in=q2)

      q4 = chatty_user.members.filter(is_dialogue=False, group_name__icontains=search_word).exclude(id__in=q1)

      q5 = ChattyGroup.objects.filter( is_dialogue=True,group_members__in=ChattyUser.objects.filter(display_name__icontains=search_word)).filter(group_members=chatty_user).exclude(id__in=q2).exclude(id__in=q3)

      q6 = ChattyGroup.objects.filter( is_dialogue=True,group_members__in=ChattyUser.objects.filter(username__icontains=search_word)).filter(group_members=chatty_user).exclude(id__in=q2).exclude(id__in=q3).exclude(id__in=q5)

      q7 = ChattyUser.objects.exclude(username=chatty_user.username).filter(display_name__iexact=search_word).filter(~Exists(ChattyGroup.objects.filter(group_members__id=OuterRef('pk')).filter(group_members__id=chatty_user.pk)))[:5]

      q8 = ChattyUser.objects.exclude(username=chatty_user.username).filter(username__iexact=search_word).filter(~Exists(ChattyGroup.objects.filter(group_members__id=OuterRef('pk')).filter(group_members__id=chatty_user.pk))).exclude(id__in=q7)[:5]

      q9 = ChattyUser.objects.exclude(username=chatty_user.username).filter(display_name__icontains=search_word).filter(~Exists(ChattyGroup.objects.filter(group_members__id=OuterRef('pk')).filter(group_members__id=chatty_user.pk))).exclude(id__in=q7).exclude(id__in=q8)[:5]

      q10 = ChattyUser.objects.exclude(username=chatty_user.username).filter(username__icontains=search_word).filter(~Exists(ChattyGroup.objects.filter(group_members__id=OuterRef('pk')).filter(group_members__id=chatty_user.pk))).exclude(id__in=q7).exclude(id__in=q8).exclude(id__in=q9)[:5]

      return_value = list(chain(q1.values(), q2.values(), q3.values(), q4.values(), q5.values(), q6.values(), q7.values(), q8.values(), q9.values(), q10.values()))

      new_result = []

      for item in return_value:

        item_result = {}

        if "is_dialogue" in item:

          last_message = Message.objects.all().filter(group=item['id']).order_by('-date_created')[:1]

          try: item_result['last_message'] = last_message[0].message

          except IndexError: item_result['last_message'] = 'No Message'

          if item['is_dialogue']:

            acquaintance = Acquaintance.objects.filter(chatty_user=chatty_user, group=item['id']).exists()

            other_user = ChattyGroup.objects.get(id=item['id']).group_members.exclude(username=chatty_user.username).values()[0]

            item_result['type'] = 'dialogue'

            item_result['id'] = item['id']

            item_result['display_name'] = other_user['display_name']

            item_result['username'] = other_user['username']

            item_result['last_seen'] = other_user['last_seen']

            item_result['picture'] = other_user['picture']

          else:

            item_result['type'] = 'group'

            item_result['id'] = item['id']

            item_result['group_name'] = item['group_name']

            item_result['name'] = item['name']

            try: item_result['last_seen'] = last_message[0].date_created

            except IndexError: item_result['last_seen'] = item['date_created']

            item_result['last_seen'] = item['date_created']

            item_result['picture'] = item['group_image']

        else:

          item_result['type'] = 'nil'

          item_result['id'] = item['id']

          item_result['display_name'] = item['display_name']

          item_result['username'] = item['username']

          item_result['last_seen'] = item['last_seen']

          item_result['picture'] = item['picture']

          item_result['last_message'] = 'No Message'


        new_result.append(item_result)


      return Response({'msg': 'Successful', 'groups': new_result})

    else:

      return Response({'msg': 'Validation Failed'})
