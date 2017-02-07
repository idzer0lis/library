#djangovuejs URL Configuration

from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from library.views import index, getRecords, getRecord

admin.autodiscover()

router = routers.DefaultRouter()
router.register(r'records', getRecords)

urlpatterns = [
    url(r'^record/(?P<name>[\w|\W]+)$', getRecord),
    url(r'^admin/', admin.site.urls),
    url(r'^$', index),
    url(r'^api/', include(router.urls)),
]
