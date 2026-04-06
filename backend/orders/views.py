from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from .models import Order

@csrf_exempt
def customer_orders(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        
        orders = Order.objects.filter(customer=user).select_related('product', 'vendor')
        data = [{
            "id": f"#ORD-{o.id:04d}", "order_id_raw": o.id, "product": o.product.id, "product_name": o.product.name,
            "vendor": o.vendor.id, "vendor_name": o.vendor.store_name, "amount": float(o.total_amount),
            "status": o.status, "date": o.created_at.strftime("%Y-%m-%d"),
            "payment_method": o.get_payment_method_display(), "payment_status": o.get_payment_status_display(),
            "image": request.build_absolute_uri(o.product.image.url) if o.product.image else ""
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_orders_list(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        
        orders = Order.objects.all().select_related('product', 'vendor', 'customer').order_by('-created_at')
        data = [{
            "id": f"#ORD-{o.id:04d}", "transaction_uuid": o.transaction_uuid,
            "product": {"id": o.product.id, "name": o.product.name, "image": request.build_absolute_uri(o.product.image.url) if o.product.image else ""},
            "vendor": {"id": o.vendor.id, "store_name": o.vendor.store_name},
            "customer": {"id": o.customer.id, "name": f"{o.customer.first_name} {o.customer.last_name}".strip() or o.customer.username, "email": o.customer.email},
            "amount": float(o.total_amount), "status": o.status, "is_paid": o.is_paid,
            "payment_method": o.get_payment_method_display(), "payment_status": o.get_payment_status_display(),
            "esewa_ref_id": o.esewa_ref_id,
            "date": o.created_at.strftime("%Y-%m-%d %H:%M"), "shipping_address": o.shipping_address,
            "commission": float(o.commission_amount), "vendor_earning": float(o.vendor_earning)
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)
