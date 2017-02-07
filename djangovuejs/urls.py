#djangovuejs URL Configuration

from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from library.views import index, getRecords, getRecord
admin.autodiscover()

from django.conf import settings
from django.conf.urls.static import static



# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'records', getRecords)

urlpatterns = [
    url(r'^record/(?P<name>[\w|\W]+)$', getRecord),
    url(r'^admin/', admin.site.urls),
    url(r'^$', index),
    url(r'^api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)