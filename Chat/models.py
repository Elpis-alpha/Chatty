from django.db import models

from django.contrib.auth.models import User

from Authentication.models import ChattyUser

import random

import os

# Create your models here.

def group_image_pathname(instance, filename):

  path = ''

  ext = filename.split('.')[-1]

  filename = f"Groups/{instance.name}/profilepic/image.{ext}"

  return os.path.join(path, filename)

def message_image_pathname(instance, filename):

  path = ''

  ext = filename.split('.')[-1]

  filename = f"Groups/{instance.group.name}/image/{instance.date_created}.{ext}"

  return os.path.join(path, filename)

def message_file_pathname(instance, filename):

  path = ''

  ext = filename.split('.')[-1]

  filename = f"Groups/{instance.group.name}/{ext}/{instance.date_created}.{ext}"

  return os.path.join(path, filename)


class Acquaintance(models.Model):

  name = models.CharField(max_length=50)

  chatty_user = models.ForeignKey(ChattyUser, on_delete=models.CASCADE, related_name='chatty_user_aq')

  user_acquaintance = models.ForeignKey(ChattyUser, on_delete=models.CASCADE, related_name='acquaintance')

  group = models.ForeignKey('ChattyGroup', on_delete=models.CASCADE)

  def __str__(self):

    return self.name


class ChattyUserSetting(models.Model):

  chatty_user = models.OneToOneField(ChattyUser, on_delete=models.CASCADE, related_name='chatty_user_set')

  people_choices = [('everybody', 'Everybody'), ('acquaintance', 'Acquaintance'), ('nobody', 'Nobody')]


  # Notification Settings

  recieve_group_notification = models.BooleanField(default=True)

  recieve_chat_notification = models.BooleanField(default=True)

  counter = models.BooleanField(default=True)


  # Privacy and Security Settings

  see_phone_number = models.CharField(max_length=30, choices=people_choices, default='acquaintance')

  see_description = models.CharField(max_length=30, choices=people_choices, default='everybody')

  see_last_seen = models.CharField(max_length=30, choices=people_choices, default='everybody')

  see_profile_photo = models.CharField(max_length=30, choices=people_choices, default='everybody')

  secretKeyCode = models.CharField(max_length=100, blank=True)

  blocked_users = models.ManyToManyField(ChattyUser, related_name='blocked_users', blank=True)
  

  # Chat Settings

  site_text_color = models.CharField(max_length=50, default='#000000')

  site_background_color = models.CharField(max_length=50, default='#f4f4f4')

  chat_message_color = models.CharField(max_length=50, default='#484aeb')

  send_by_enter = models.BooleanField(default=True)

  theme = models.CharField(max_length=10, choices=[('light', 'Light'), ('dark', 'Dark')], default='light')

  def __str__(self):

    return self.chatty_user.display_name + ' Settings'

  def save(self, *args, **kwargs):

    if not self.pk: # Only works of object isn't in database

      self.secretKeyCode = self.chatty_user.token

    super(ChattyUserSetting, self).save(*args, **kwargs)


class ChattyUserNotification(models.Model):

  chatty_user = models.ForeignKey(ChattyUser, on_delete=models.CASCADE, related_name='chatty_user_not')

  name = models.CharField(max_length=50)

  detail = models.CharField(max_length=50)

  header = models.CharField(max_length=50)

  content = models.TextField()

  date_sent = models.BigIntegerField()

  def __str__(self):

    return str(self.chatty_user) + ' Notification'


class ChattyGroup(models.Model):

  name = models.CharField(max_length=100, blank=True, unique=True, editable=False)

  group_name = models.CharField(max_length=50, blank=True, null=True)

  group_admin = models.ManyToManyField(ChattyUser, related_name='admin', blank=True)

  group_members = models.ManyToManyField(ChattyUser, related_name='members')

  group_image = models.ImageField(upload_to=group_image_pathname, blank=True)

  group_description = models.TextField(blank=True, null=True)

  date_created = models.BigIntegerField()

  secret_key_admin = models.CharField(max_length=50, default='', blank=True)

  secret_key_join = models.CharField(max_length=50, default='', blank=True)

  is_dialogue = models.BooleanField()

  def __str__(self):

    return self.name

  def save(self, *args, **kwargs):

    if not self.pk:

      super(ChattyGroup, self).save(*args, **kwargs)

      self.secret_key_admin = str(self.pk) + '-' + User.objects.make_random_password() + User.objects.make_random_password() + User.objects.make_random_password()

      self.secret_key_join = str(self.pk) + '-' + User.objects.make_random_password() + User.objects.make_random_password() + User.objects.make_random_password()

      self.name = 'Gp-' + str(self.pk)

    super(ChattyGroup, self).save(*args, **kwargs)


class ChattyGroupSetting(models.Model):

  group = models.ForeignKey(ChattyGroup, on_delete=models.CASCADE)

  chatty_user = models.ForeignKey(ChattyUser, on_delete=models.CASCADE)

  muted = models.BooleanField(default=False)

  pinned = models.BooleanField(default=False)

  date_joined = models.BigIntegerField()

  def __str__(self):

    return str(self.chatty_user)


class Message(models.Model):

  message_type = models.CharField(max_length=50, choices=[
    ('Text', 'Text'),
    ('Pure Text', 'Pure Text'),
    ('Image with Caption', 'Image with Caption'),
    ('File with Caption', 'File with Caption'),
    ('Text with Refferal', 'Text with Refferal'),
    ('Image with Refferal', 'Image with Refferal'),
    ('File with Refferal', 'File with Refferal'),
  ])

  sender = models.ForeignKey(ChattyUser, on_delete=models.CASCADE, blank=True, null=True)

  group = models.ForeignKey(ChattyGroup, on_delete=models.CASCADE)

  image = models.ImageField(null=True, blank=True, upload_to=message_image_pathname)

  other_file = models.FileField(null=True, blank=True, upload_to=message_file_pathname)

  message_refer = models.ForeignKey('Message', on_delete=models.SET_NULL, related_name='message_to', blank=True, null=True)

  date_created = models.BigIntegerField()

  date_received = models.BigIntegerField(blank=True, null=True)

  pinned = models.BooleanField(default=False)

  message = models.TextField(blank=True, null=True)

  def __str__(self):

    return f"to {self.group.name}"

