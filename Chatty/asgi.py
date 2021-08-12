"""
ASGI config for Chatty project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os, django

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter, get_default_application

from channels.auth import AuthMiddlewareStack



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chatty.settings')

django.setup()

application = get_default_application()
