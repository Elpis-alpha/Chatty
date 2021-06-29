# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [

  path('ws/chatty_user/<username>/', consumers.ChattyConsumer.as_asgi())

]