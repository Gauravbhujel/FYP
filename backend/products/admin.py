from django.contrib import admin
from .models import Product, ProductReview, CartItem, WishlistItem

admin.site.register(Product)
admin.site.register(ProductReview)
admin.site.register(CartItem)
admin.site.register(WishlistItem)
