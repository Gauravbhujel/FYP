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

v = Vendor.objects.filter(status='approved').first()
if not v:
    print("No approved vendor found.")
    sys.exit()

print(f"Vendor: {v.store_name}")
today = date.today()

for i in range(20, -1, -1):
    day = today - timedelta(days=i)
    aggr = Order.objects.filter(vendor=v, created_at__date=day).exclude(status='canceled').aggregate(
        total=Sum('total_amount'),
        earn=Sum('vendor_earning')
    )
    if aggr['total']:
        print(f"Date: {day} ({day.strftime('%a')}), Total Sales: {aggr['total']}, Earn: {aggr['earn']}")
