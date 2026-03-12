from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import serializers
from .models import Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProductSerializer(serializers.ModelSerializer):
    vendor_store_name = serializers.ReadOnlyField(source='vendor.store_name')

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'vendor_store_name', 'name', 'description', 
            'category', 'price', 'compare_price', 'sku', 'quantity', 
            'image_url', 'is_active', 'created_at'
        ]
        read_only_fields = ['vendor', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone_number', 'address', 'profile_picture', 
            'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined']
