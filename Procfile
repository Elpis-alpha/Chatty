release: python manage.py migrate
export DJANGO_SETTINGS_MODULE=mysite.settings
heroku config:set DJANGO_SETTINGS_MODULE=chatty409.settings --account Elpis
web: daphne Chatty.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channel_layer -v2