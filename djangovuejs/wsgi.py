# WSGI config for djangovuejs project.

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangovuejs.settings")

application = get_wsgi_application()

# if using gunicorn enable this section
# from whitenoise.django import DjangoWhiteNoise
# application = DjangoWhiteNoise(application)
