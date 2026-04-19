from rest_framework import serializers
from .models import Product, ProductReview, CartItem, WishlistItem, ProductImage, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']

class ProductReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = ProductReview
        fields = ['id', 'customer', 'customer_name', 'product', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'created_at', 'updated_at']

class ProductSerializer(serializers.ModelSerializer):
    vendor_store_name = serializers.ReadOnlyField(source='vendor.store_name')
    category_slug = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    # For backward compatibility, keep 'category' as a string during read
    category_display = serializers.SerializerMethodField()

    def get_category_slug(self, obj):
        try:
            return obj.category.slug if obj.category else "all"
        except Exception:
            return "all"

    def get_category_name(self, obj):
        try:
            return obj.category.name if obj.category else "Uncategorized"
        except Exception:
            return "Uncategorized"

    def get_category_display(self, obj):
        return self.get_category_name(obj)
    
    # Relationships
    reviews = ProductReviewSerializer(many=True, read_only=True)
    gallery = ProductImageSerializer(many=True, read_only=True)
    
    # Method fields
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    is_new = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'vendor_store_name', 'name', 'description', 
            'category', 'category_name', 'category_slug', 'category_display', 
            'price', 'compare_price', 'sku', 'quantity', 
            'gallery', 'is_active', 'created_at', 'reviews', 
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
            return float(((obj.compare_price - obj.price) / obj.compare_price) * 100)
        return None

    def get_is_new(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.created_at).days < 7

    def to_representation(self, instance):
        # Override to ensure 'category' field in JSON is the name (string) 
        # for backward compatibility with React state, while maintaining FK for writes
        data = super().to_representation(instance)
        try:
            if instance.category:
                data['category'] = instance.category.name
            else:
                data['category'] = "Uncategorized"
        except Exception:
            data['category'] = "Uncategorized"
        return data

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
