import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chatty.settings')


import django

django.setup()


import random

from faker import Faker

fakegen = Faker()


from Authentication.models import ChattyUser

from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token

from Chat.models import ChattyUserSetting



def create_user():

  name = fakegen.name()

  try: name = name.split('. ')[1]

  except: name = name

  username = name.split(' ')[0]

  email = fakegen.email()

  password = ''

  all_users = User.objects.all()


  # -------------------------------------------- Username starts

  for item in all_users:

    if item.username == username:

      username = username + str(random.randint(100, 999))

    else:

      pass

  # -------------------------------------------- Username ends


  # -------------------------------------------- Email starts

  end_suffix = '@' + email.split('@')[1]
  
  email = username + end_suffix

  # -------------------------------------------- Email ends


  # -------------------------------------------- Password starts

  if len(username) < 5: password = username + username

  else: password = username

  # -------------------------------------------- Password ends


  # -------------------------------------------- Final Validation

  try:

    user = User.objects.create(username=username, email=email)

    user.set_password(password)

    user.save()

    token = create_token(user)

    chatty_user = create_chatty_user(name, user, token)

    chatty_user_settings = create_chatty_user_settings(chatty_user)

    return {'name': name, 'user': user, 'token': token, 'chatty_user': chatty_user, 'settings': chatty_user_settings}

  except:

    print(f"Either of these were wrong: {username}, {email}")


def create_token(user):

  token = Token.objects.create(user=user)

  return token


def create_chatty_user(name, user, token):

  date_created = random.randint(1277045158892, 1592664358892)

  last_seen = random.randint(1622558758892, 1624200306606)

  number = fakegen.phone_number()

  chatty_user = ChattyUser(user=user, username=user.username, email=user.email, display_name=name, token=str(token), date_created=date_created, last_seen=last_seen, number=number)

  chatty_user.save()

  return chatty_user


def create_chatty_user_settings(chatty_user):

  chatty_user_setting = ChattyUserSetting.objects.create(chatty_user=chatty_user)

  return chatty_user_setting
  


def populate_database(number):

  for entry in range(number):

    item = create_user()

    print(item)


if __name__ == '__main__':

  print('Populating Database...')

  populate_database(50)

  print('Database Populated')
