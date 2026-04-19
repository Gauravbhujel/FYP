import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from orders.models import Order

def delete_orders(order_ids):
    for oid in order_ids:
        try:
            order = Order.objects.get(id=oid)
            order.delete()
            print(f"Successfully deleted order ID: {oid}")
        except Order.DoesNotExist:
            print(f"Order with ID {oid} not found.")
        except Exception as e:
            print(f"Error deleting order {oid}: {e}")

if __name__ == "__main__":
    # Deleting the orders shown in the screenshot (IDs 1-6)
    delete_orders([1, 2, 3, 4, 5, 6])
