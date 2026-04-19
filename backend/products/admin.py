from django.contrib import admin
from .models import Product, ProductReview, CartItem, WishlistItem, ProductImage, Category

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'price', 'quantity', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'vendor']
    search_fields = ['name', 'description', 'sku']
    inlines = [ProductImageInline]

admin.site.register(ProductReview)
admin.site.register(CartItem)
admin.site.register(WishlistItem)
admin.site.register(ProductImage)
