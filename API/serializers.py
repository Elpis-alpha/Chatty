from django.contrib.auth.models import User

from rest_framework import serializers

from Authentication.models import ChattyUser

from Chat.models import ChattyGroup

from Chat.models import Message

from Chat.models import ChattyUserNotification


class ChattyUserSerializer(serializers.HyperlinkedModelSerializer):

  class Meta:

    model = ChattyUser

    fields = ['id', 'username', 'display_name', 'email', 'biography', 'picture', 'date_created', 'last_seen', 'number']


class ChattyGroupSerializer(serializers.ModelSerializer):

  class Meta:

    model = ChattyGroup

    fields = ['id', 'name', 'group_name', 'date_created', 'group_image', 'group_description', 'group_admin', 'group_members', 'is_dialogue']


class MessageSerializer(serializers.ModelSerializer):

  class Meta:

    model = Message

    fields = [

        "id", "message_type", "sender", "group", "image",

        "other_file", "message_refer", "date_created",

        "date_received", "pinned", "message"
        ]


class ChattyUserNotificationSerializer(serializers.ModelSerializer):

  class Meta:

    model = ChattyUserNotification

    fields = ['id', 'chatty_user','name', 'detail', 'header','content','date_sent',]
