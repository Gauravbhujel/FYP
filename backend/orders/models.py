import uuid
import random
from django.db import models
from django.conf import settings



# --- NEW NORMALIZED MODELS ---

class MasterOrder(models.Model):
    """
    The parent order record representing a single checkout event.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='master_orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "order_master"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.customer.username}"


class OrderItem(models.Model):
    """
    Individual items within a MasterOrder.
    """
    order = models.ForeignKey(MasterOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='order_items')
    vendor = models.ForeignKey('vendors.Vendor', on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at time of purchase
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    vendor_earning = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=MasterOrder.STATUS_CHOICES, default='pending')
    
    # Payout tracking
    payout_status = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('paid', 'Paid')), default='pending')
    payout_date = models.DateTimeField(null=True, blank=True)
    
    # Courier tracking
    tracking_id = models.CharField(max_length=30, null=True, blank=True, unique=True)
    courier_name = models.CharField(max_length=30, null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_tracking(self):
        if not self.tracking_id:
            self.tracking_id = f"GUN-{uuid.uuid4().hex[:8].upper()}"
        return self.tracking_id

    def save(self, *args, **kwargs):
        # Auto-generate tracking if status is shipped/delivered and tracking is missing
        if self.status in ['shipped', 'delivered'] and not self.tracking_id:
            self.generate_tracking()
        super().save(*args, **kwargs)

    class Meta:
        db_table = "order_items"
        ordering = ['-created_at']

    def __str__(self):
        return f"Item: {self.product.name} (Order #{self.order.id})"
