from django.db import models
from django.conf import settings

class Vendor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_profile')
    store_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    role = models.CharField(max_length=20, default='vendor')
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_feedback = models.TextField(blank=True, null=True)
    
    # Financial tracking
    pending_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    paid_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    last_payout_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "LoginSignup_vendor"

    @property
    def average_rating(self):
        # Using string references to models to avoid circular imports
        from products.models import ProductReview
        # Wait, I found I had 'products' as app name too. I'll use 'products' as it was specified.
        from products.models import ProductReview
        from vendors.models import VendorReview
        p_reviews = ProductReview.objects.filter(product__vendor=self)
        v_reviews = VendorReview.objects.filter(vendor=self)
        
        all_ratings = [r.rating for r in p_reviews] + [r.rating for r in v_reviews]
        if not all_ratings:
            return 0.0
        return round(sum(all_ratings) / len(all_ratings), 1)
    
    @property
    def review_count(self):
        from products.models import ProductReview
        return ProductReview.objects.filter(product__vendor=self).count() + VendorReview.objects.filter(vendor=self).count()

    @property
    def service_rating(self):
        v_reviews = VendorReview.objects.filter(vendor=self)
        if not v_reviews.exists():
            return 0.0
        return round(sum(r.rating for r in v_reviews) / v_reviews.count(), 1)

    def __str__(self):
        return self.store_name


class VendorReview(models.Model):
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_reviews')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='vendor_reviews')
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='vendor_review')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "LoginSignup_vendorreview"
        unique_together = ('customer', 'vendor', 'order')
        ordering = ['-created_at']

    def __str__(self):
        return f"Vendor Review by {self.customer.username} for {self.vendor.store_name}"
