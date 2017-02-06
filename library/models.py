from __future__ import unicode_literals

from django.db import models

class Authors(models.Model):
	name = models.CharField(max_length=200)

	def get_json(self):
		return {
		    'name': self.name,
		    'books': [{'title': b.book} for b in self.books_set.all()] }

class Books(models.Model):
	author = models.ForeignKey(Authors, related_name='book')
	book = models.CharField(max_length=200)
