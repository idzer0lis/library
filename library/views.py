from django.template.response import TemplateResponse
from django.http import HttpResponse
from .models import Authors, Books
from rest_framework import viewsets
from .serializers import AuthorSerializer
from django.core import serializers
from django.utils import simplejson

def index(request):
    context = {}
    context['authors'] = Authors.objects.all()
    html = TemplateResponse(request, 'table.html', context)
    return HttpResponse(html.render())

def getRecord(request, name):
	books = serializers.serialize('json',Books.objects.filter(author__name=name))
	author = serializers.serialize('json',Authors.objects.filter(name=name))
	response = {  
		'author': author,
		'books': books
	}

	return HttpResponse(simplejson.dumps(response), content_type="application/json")

class getRecords(viewsets.ModelViewSet):
	queryset = Authors.objects.all()
	serializer_class = AuthorSerializer
