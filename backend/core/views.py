from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import StaticPage
from .serializers import StaticPageSerializer

# Create your views here.

class StaticPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StaticPage.objects.all()
    serializer_class = StaticPageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
