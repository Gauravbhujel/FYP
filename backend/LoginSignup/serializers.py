from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import serializers
from .models import Product, CartItem, WishlistItem, ProductReview, Vendor

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            'id', 'user', 'store_name', 'phone', 'address', 'city', 
            'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = ProductReview
        fields = ['id', 'customer', 'customer_name', 'product', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    vendor_store_name = serializers.ReadOnlyField(source='vendor.store_name')
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'vendor_store_name', 'name', 'description', 
            'category', 'category_display', 'price', 'compare_price', 'sku', 'quantity', 
            'image', 'image2', 'image3', 'is_active', 'created_at', 'reviews', 'average_rating'
        ]
        read_only_fields = ['vendor', 'created_at']
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone_number', 'address', 'profile_picture', 
            'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'created_at']

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id', 'created_at']
