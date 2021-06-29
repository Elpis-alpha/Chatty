from django.db import models

from django.contrib.auth.models import User

import os

# Create your models here.

def image_pathname(instance, filename):

  path = ''

  ext = filename.split('.')[-1]

  filename = f"Users/{instance.username}/profilepic/image.{ext}"

  return os.path.join(path, filename)


class ChattyUser(models.Model):

  user = models.OneToOneField(User, on_delete=models.CASCADE)

  display_name = models.CharField(max_length=50)

  username = models.CharField(max_length=100)

  email = models.EmailField()

  token = models.CharField(max_length=500)

  biography = models.TextField(max_length=500, blank=True, null=True)

  picture = models.ImageField(upload_to=image_pathname, blank=True, null=True)

  number = models.CharField(max_length=50, blank=True, null=True)

  date_created = models.BigIntegerField()

  last_seen = models.BigIntegerField(blank=True, null=True)

  def __str__(self):

    return self.display_name

    
