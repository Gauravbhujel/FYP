from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone_number', 'address', 'profile_picture', 
            'is_active', 'date_joined', 'orders_count', 'reviews_count'
        ]
        read_only_fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined']

    def get_orders_count(self, obj):
        return obj.customer_orders.count()

    def get_reviews_count(self, obj):
        return obj.reviews.count()
