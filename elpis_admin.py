import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chatty.settings')


import django

django.setup()


from django.contrib.auth.models import User


elpis = User.objects.get(username="Elpis")

elpis.is_superuser = True

elpis.is_staff = True

elpis.save()
