from rest_framework import serializers
from .models import StaticPage

class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = ['title', 'slug', 'content', 'updated_at']
