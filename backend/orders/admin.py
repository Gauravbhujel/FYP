from django.contrib import admin
from .models import MasterOrder, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'vendor', 'quantity', 'price', 'total_amount']

@admin.register(MasterOrder)
class MasterOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer__email', 'customer__username']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'vendor', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'vendor', 'created_at']
    search_fields = ['product__name', 'vendor__store_name', 'order__id']
