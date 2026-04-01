import os
import django
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from LoginSignup.models import Order

def backfill_order_financials():
    print("Starting backfill of order financials...")
    orders = Order.objects.all()
    count = 0
    
    for order in orders:
        # Calculate 5% commission and 95% earning based on total_amount
        # We only do this if they are currently 0.00 to avoid overwriting manually adjusted values
        if order.commission_amount == 0 and order.vendor_earning == 0:
            order.commission_amount = order.total_amount * Decimal('0.05')
            order.vendor_earning = order.total_amount - order.commission_amount
            order.save()
            count += 1
            
    print(f"Successfully updated {count} orders.")

if __name__ == "__main__":
    backfill_order_financials()
