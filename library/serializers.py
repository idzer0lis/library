from models import Authors, Books
from rest_framework import serializers

class BookSerializer(serializers.ModelSerializer):
	class Meta:
		model = Books
		fields = ('book',) #single value tuple

class AuthorSerializer(serializers.ModelSerializer):
	book = BookSerializer(many=True)
	class Meta:
		model = Authors
		fields =('id', 'name', 'book')


