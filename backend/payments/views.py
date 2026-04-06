from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from decimal import Decimal
import json
import uuid
import base64
from orders.models import Order
from products.models import Product, CartItem
from .esewa_utils import generate_esewa_signature, verify_esewa_payment

@csrf_exempt
def initiate_payment(request):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            data = json.loads(request.body)
            cart_data, address = data.get('cart_items', []), data.get('shipping_address', '')
            if not cart_data: return JsonResponse({"error": "Empty cart"}, status=400)
            
            total_amount, transaction_uuid = 0, str(uuid.uuid4())
            payment_method = data.get('payment_method', 'EPAY')
            with transaction.atomic():
                for item in cart_data:
                    p = Product.objects.get(id=item.get('product_id'))
                    qty = int(item.get('quantity', 1))
                    if p.quantity < qty: return JsonResponse({"error": f"Stock low for {p.name}"}, status=400)
                    amt = p.price * qty
                    total_amount += amt
                    comm = amt * Decimal('0.05')
                    Order.objects.create(
                        product=p, customer=user, vendor=p.vendor, quantity=qty,
                        total_amount=amt, commission_amount=comm, vendor_earning=amt-comm,
                        status='pending', shipping_address=address, transaction_uuid=transaction_uuid,
                        payment_method=payment_method
                    )

            if payment_method == 'COD':
                # For COD, the order is confirmed immediately. Stock is reduced and cart cleared.
                with transaction.atomic():
                    items = Order.objects.filter(transaction_uuid=transaction_uuid)
                    for o in items:
                        o.product.quantity = max(0, o.product.quantity - o.quantity)
                        o.product.save()
                    CartItem.objects.filter(customer=user).delete()
                
                return JsonResponse({
                    "message": "Order placed successfully (COD)",
                    "transaction_uuid": transaction_uuid,
                    "payment_method": "COD"
                }, status=200)
            
            # Use a consistent formatting for all numeric strings sent to eSewa.
            def format_amt(val):
                # Returns "99" for 99.0, or "99.5" for 99.50
                return str(float(val)).rstrip('0').rstrip('.') if float(val) % 1 == 0 else f"{val:.2f}".rstrip('0').rstrip('.')

            amt_str = format_amt(total_amount)
            zero_str = format_amt(0)

            p_code = getattr(settings, 'ESEWA_PRODUCT_CODE', 'EPAYTEST')
            # Signature message must use the EXACT strings being sent in the form
            signature = generate_esewa_signature(amt_str, transaction_uuid, p_code)
            base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
            
            return JsonResponse({
                "amount": amt_str, 
                "tax_amount": zero_str, 
                "total_amount": amt_str,
                "transaction_uuid": transaction_uuid, 
                "product_code": p_code,
                "product_service_charge": zero_str, 
                "product_delivery_charge": zero_str,
                "success_url": f"{base_url}/api/payment/success/", 
                "failure_url": f"{base_url}/api/payment/failure/",
                "signed_field_names": "total_amount,transaction_uuid,product_code", 
                "signature": signature,
                "esewa_url": "https://rc-epay.esewa.com.np/api/epay/main/v2/form" if getattr(settings, 'ESEWA_IS_SANDBOX', True) else "https://epay.esewa.com.np/api/epay/main/v2/form"
            }, status=200)
        except Exception as e: return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def payment_success(request):
    data_enc = request.GET.get('data')
    if not data_enc: return JsonResponse({"error": "No data"}, status=400)
    try:
        data = json.loads(base64.b64decode(data_enc).decode('utf-8'))
        t_uuid, t_amt, status, ref_id = data.get('transaction_uuid'), data.get('total_amount'), data.get('status'), data.get('transaction_code')
        if status == 'COMPLETE':
            p_code = getattr(settings, 'ESEWA_PRODUCT_CODE', 'EPAYTEST')
            success, _ = verify_esewa_payment(t_uuid, t_amt, p_code)
            if success:
                with transaction.atomic():
                    items = Order.objects.filter(transaction_uuid=t_uuid)
                    for o in items:
                        o.product.quantity = max(0, o.product.quantity - o.quantity)
                        o.product.save()
                    items.update(is_paid=True, payment_status='paid', esewa_ref_id=ref_id, status='processing')
                    first = items.first()
                    if first: CartItem.objects.filter(customer=first.customer).delete()
                from django.shortcuts import redirect
                return redirect(f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/payment-success?oid={t_uuid}")
            return JsonResponse({"error": "Verification failed"}, status=400)
        return JsonResponse({"error": "Not complete"}, status=400)
    except Exception as e: return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def payment_failure(request):
    t_uuid = request.GET.get('oid')
    if t_uuid: Order.objects.filter(transaction_uuid=t_uuid).update(status='canceled')
    from django.shortcuts import redirect
    return redirect(f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/payment-failure")
