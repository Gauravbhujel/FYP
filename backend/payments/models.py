from django.db import models

class Payment(models.Model):
    order = models.OneToOneField('orders.MasterOrder', on_delete=models.CASCADE, related_name='payment')
    transaction_uuid = models.CharField(max_length=100, unique=True)
    payment_method = models.CharField(max_length=20, choices=(('EPAY', 'ePay'), ('COD', 'Cash on Delivery')))
    payment_status = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('canceled', 'Canceled')), default='pending')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    esewa_ref_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payments"

    def __str__(self):
        return f"Payment for MasterOrder {self.order.id} - {self.payment_status}"
