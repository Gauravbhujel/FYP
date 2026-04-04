from rest_framework import serializers
from .models import Vendor, VendorReview

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'user', 'store_name', 'phone', 'address', 'city', 
            'status', 'created_at', 'average_rating', 'review_count', 'service_rating'
        ]
        read_only_fields = ['status', 'created_at', 'average_rating', 'review_count', 'service_rating']

class VendorReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = VendorReview
        fields = ['id', 'customer', 'customer_name', 'vendor', 'order', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'created_at', 'updated_at']
