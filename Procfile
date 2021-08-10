release: python manage.py migrate
web: gunicorn Chatty.wsgi
websocket: daphne Chatty.asgi:application
