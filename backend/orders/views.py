from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import json
from rest_framework.authtoken.models import Token
from .models import Order

@csrf_exempt
def cancel_order(request, order_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        
        try:
            # Check if order_id is a formatted string like #ORD-0001
            processed_id = order_id
            if isinstance(order_id, str) and order_id.startswith("#ORD-"):
                processed_id = int(order_id.replace("#ORD-", ""))
            
            order = Order.objects.get(id=processed_id, customer=user)
            if order.status not in ['pending', 'processing']:
                return JsonResponse({"error": f"Cannot cancel order in {order.status} status."}, status=400)
            
            if order.status == 'canceled':
                return JsonResponse({"error": "Order is already cancelled."}, status=400)

            data = json.loads(request.body)
            reason = data.get("reason", "No reason provided")
            
            order.status = 'canceled'
            order.cancelled_by = 'customer'
            order.cancelled_at = timezone.now()
            order.cancel_reason = reason
            order.vendor_earning = 0.00
            order.commission_amount = 0.00
            
            if order.is_paid:
                order.refund_status = 'pending'
            
            order.save()
            
            # Notify Vendor
            try:
                send_mail(
                    'Order Cancelled - GearUpNepal',
                    f'Customer {user.get_full_name() or user.username} has cancelled Order #ORD-{order.id:04d}.\nReason: {reason}',
                    settings.EMAIL_HOST_USER,
                    [order.vendor.user.email],
                    fail_silently=True,
                )
            except Exception:
                pass
                
            return JsonResponse({
                "message": "Order cancelled successfully", 
                "order": {
                    "id": f"#ORD-{order.id:04d}",
                    "status": order.status,
                    "cancelled_by": order.cancelled_by,
                    "cancelled_at": order.cancelled_at.isoformat() if order.cancelled_at else None
                }
            }, status=200)
        except Order.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method"}, status=405)

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
