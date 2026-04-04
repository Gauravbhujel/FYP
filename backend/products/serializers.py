from rest_framework import serializers
from .models import Product, ProductReview, CartItem, WishlistItem

class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = ProductReview
        fields = ['id', 'customer', 'customer_name', 'product', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    vendor_store_name = serializers.ReadOnlyField(source='vendor.store_name')
    category_slug = serializers.ReadOnlyField(source='category')
    category = serializers.CharField(source='get_category_display', read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    is_new = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'vendor_store_name', 'name', 'description', 
            'category', 'category_slug', 'price', 'compare_price', 'sku', 'quantity', 
            'image', 'image2', 'image3', 'is_active', 'created_at', 'reviews', 
            'average_rating', 'review_count', 'discount', 'is_new', 'size'
        ]
        read_only_fields = ['vendor', 'created_at']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_discount(self, obj):
        if obj.compare_price and obj.compare_price > obj.price:
            return int(((obj.compare_price - obj.price) / obj.compare_price) * 100)
        return None

    def get_is_new(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.created_at).days < 7

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
