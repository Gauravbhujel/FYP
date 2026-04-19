from django.db import transaction
from orders.models import Order, MasterOrder, OrderItem
from payments.models import Payment
from products.models import Product, ProductImage

def migrate_product_images():
    print("Migrating Product Images...")
    products = Product.objects.all()
    count = 0
    for product in products:
        # Move primary image
        if product.image:
            ProductImage.objects.get_or_create(
                product=product,
                image=product.image,
                is_main=True
            )
            count += 1
        
        # Move extra images
        if product.image2:
            ProductImage.objects.get_or_create(
                product=product,
                image=product.image2,
                is_main=False
            )
            count += 1
        
        if product.image3:
            ProductImage.objects.get_or_create(
                product=product,
                image=product.image3,
                is_main=False
            )
            count += 1
    print(f"Successfully migrated {count} product images.")

def migrate_orders():
    print("Migrating Orders to Normalized Structure...")
    # Group legacy orders by transaction_uuid
    legacy_orders = Order.objects.all()
    
    transaction_groups = {}
    for lo in legacy_orders:
        key = lo.transaction_uuid if lo.transaction_uuid else f"fallback_{lo.customer.id}_{lo.created_at.strftime('%Y%m%d%H%M')}"
        if key not in transaction_groups:
            transaction_groups[key] = []
        transaction_groups[key].append(lo)

    order_count = 0
    item_count = 0
    payment_count = 0

    for uuid_key, items in transaction_groups.items():
        first_item = items[0]
        
        with transaction.atomic():
            # 1. Create Master Order
            mo = MasterOrder.objects.create(
                customer=first_item.customer,
                total_amount=sum(item.total_amount for item in items),
                shipping_address=first_item.shipping_address,
                status=first_item.status,
                created_at=first_item.created_at
            )
            order_count += 1

            # 2. Create Payment
            if first_item.transaction_uuid or first_item.payment_method == 'COD':
                tx_uuid = first_item.transaction_uuid if first_item.transaction_uuid else f"COD-{mo.id}-{uuid_key[-4:]}"
                
                Payment.objects.create(
                    order=mo,
                    transaction_uuid=tx_uuid,
                    payment_method=first_item.payment_method,
                    payment_status=first_item.payment_status,
                    amount=mo.total_amount,
                    esewa_ref_id=first_item.esewa_ref_id,
                    created_at=first_item.created_at
                )
                payment_count += 1

            # 3. Create Order Items
            for lo in items:
                OrderItem.objects.create(
                    order=mo,
                    product=lo.product,
                    vendor=lo.vendor,
                    quantity=lo.quantity,
                    price=lo.total_amount / lo.quantity if lo.quantity > 0 else 0,
                    total_amount=lo.total_amount,
                    commission_amount=lo.commission_amount,
                    vendor_earning=lo.vendor_earning,
                    status=lo.status,
                    tracking_id=lo.tracking_id,
                    courier_name=lo.courier_name,
                    shipped_at=lo.shipped_at,
                    estimated_delivery=lo.estimated_delivery,
                    created_at=lo.created_at
                )
                item_count += 1

    print(f"Successfully migrated {order_count} Master Orders, {item_count} items, and {payment_count} payments.")

# Run the functions
migrate_product_images()
migrate_orders()
