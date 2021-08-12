# chat/routing.py
from django.urls import re_path, path

from Chat import consumers

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter, get_default_application

from channels.auth import AuthMiddlewareStack


application = ProtocolTypeRouter({

    "websocket": AuthMiddlewareStack(

        URLRouter(

            [path('ws/chatty_user/<username>/', consumers.ChattyConsumer.as_asgi())]

        )

    ),
})
