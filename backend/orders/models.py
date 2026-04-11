from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    )

    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='orders')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_orders')
    vendor = models.ForeignKey('vendors.Vendor', on_delete=models.CASCADE, related_name='vendor_orders')
    quantity = models.PositiveIntegerField(default=1)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    vendor_earning = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField(blank=True)
    transaction_uuid = models.CharField(max_length=100, unique=False, null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=(('EPAY', 'ePay'), ('COD', 'Cash on Delivery')), default='EPAY')
    payment_status = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')), default='pending')
    is_paid = models.BooleanField(default=False)
    esewa_ref_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Payout tracking
    PAYOUT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    )
    payout_status = models.CharField(max_length=20, choices=PAYOUT_STATUS_CHOICES, default='pending')
    payout_date = models.DateTimeField(null=True, blank=True)
    
    # Cancellation tracking
    cancelled_by = models.CharField(max_length=10, choices=(('customer', 'Customer'), ('vendor', 'Vendor'), ('admin', 'Admin')), null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(null=True, blank=True)
    refund_status = models.CharField(max_length=20, choices=(('not_required', 'Not Required'), ('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')), default='not_required')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "LoginSignup_order"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"
