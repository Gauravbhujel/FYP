import os
import django
import sys

# Add the project directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vendors.models import Vendor
from orders.models import Order
from django.db.models import Sum
from django.db import transaction

def backfill_balances():
    vendors = Vendor.objects.all()
    print(f"Propagating balances for {vendors.count()} vendors...")
    
    with transaction.atomic():
        for vendor in vendors:
            # Calculate pending: Delivered orders with payout_status='pending'
            pending_total = Order.objects.filter(
                vendor=vendor, 
                status='delivered', 
                payout_status='pending'
            ).aggregate(total=Sum('vendor_earning'))['total'] or 0
            
            # Calculate paid: Anything with payout_status='paid'
            paid_total = Order.objects.filter(
                vendor=vendor, 
                payout_status='paid'
            ).aggregate(total=Sum('vendor_earning'))['total'] or 0
            
            vendor.pending_balance = pending_total
            vendor.paid_balance = paid_total
            vendor.save()
            
            print(f"Vendor {vendor.store_name}: Pending={pending_total}, Paid={paid_total}")

if __name__ == "__main__":
    backfill_balances()
