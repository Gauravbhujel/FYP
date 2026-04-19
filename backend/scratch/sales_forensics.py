import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db.models import Sum
from datetime import date, timedelta
from orders.models import Order
from vendors.models import Vendor

for v in Vendor.objects.filter(status='approved'):
    print(f"\n--- Vendor: {v.store_name} (ID: {v.id}) ---")
    orders = Order.objects.filter(vendor=v).exclude(status='canceled')
    for o in orders:
        print(f"Order {o.id}: Date {o.created_at.date()} ({o.created_at.strftime('%a')}), Gross: {o.total_amount}, Net: {o.vendor_earning}, Status: {o.status}")
    
    today = date.today()
    print("\nDaily Aggregates (past 10 days):")
    for i in range(10, -1, -1):
        day = today - timedelta(days=i)
        aggr = Order.objects.filter(vendor=v, created_at__date=day).exclude(status='canceled').aggregate(
            total=Sum('total_amount'),
            earn=Sum('vendor_earning')
        )
        if aggr['total']:
            print(f"Date: {day} ({day.strftime('%a')}), Gross: {aggr['total']}, Earn: {aggr['earn']}")
