release:python manage.py migrate
web: gunicorn Chatty.wsgi
websocket:daphne -b 0.0.0.0 -p 5000 Chatty.asgi:application