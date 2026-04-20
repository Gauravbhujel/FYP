from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import json
from rest_framework.authtoken.models import Token
from .models import MasterOrder, OrderItem
from payments.models import Payment

@csrf_exempt
def cancel_order(request, order_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        
        try:
            processed_id = order_id
            if isinstance(order_id, str) and order_id.startswith("#ORD-"):
                processed_id = int(order_id.replace("#ORD-", ""))
            
            mo = MasterOrder.objects.get(id=processed_id, customer=user)
            if mo.status not in ['pending', 'processing']:
                return JsonResponse({"error": f"Cannot cancel order in {mo.status} status."}, status=400)
            
            data = json.loads(request.body)
            reason = data.get("reason", "No reason provided")
            
            mo.status = 'canceled'
            mo.save()
            
            # Update all items
            mo.items.all().update(status='canceled', vendor_earning=0.00, commission_amount=0.00)
            
            # Update payment if exists
            Payment.objects.filter(order=mo).update(payment_status='canceled')
                
            return JsonResponse({
                "message": "Order cancelled successfully", 
                "order": {
                    "id": f"#ORD-{mo.id:04d}",
                    "status": mo.status
                }
            }, status=200)
        except MasterOrder.DoesNotExist:
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
        
        # We return a flat list of items for backward compatibility with the frontend
        items = OrderItem.objects.filter(order__customer=user).select_related('product', 'vendor', 'order', 'order__payment')
        data = [{
            "id": f"#ORD-{oi.order.id:04d}", 
            "order_id_raw": oi.order.id,
            "item_id": oi.id,
            "order_item_id": oi.id,
            "product": oi.product.id, 
            "product_name": oi.product.name,
            "vendor": oi.vendor.id, 
            "vendor_name": oi.vendor.store_name, 
            "amount": float(oi.total_amount),
            "status": oi.status, 
            "date": oi.created_at.strftime("%Y-%m-%d"),
            "payment_method": oi.order.payment.get_payment_method_display() if hasattr(oi.order, 'payment') else "N/A", 
            "payment_status": oi.order.payment.get_payment_status_display() if hasattr(oi.order, 'payment') else "N/A",
            "image": request.build_absolute_uri(oi.product.gallery.first().image.url) if oi.product.gallery.exists() else "",
            "tracking_id": oi.tracking_id,
            "courier_name": oi.courier_name,
            "shipped_at": oi.shipped_at.strftime("%Y-%m-%d %H:%M") if oi.shipped_at else None,
            "estimated_delivery": oi.estimated_delivery.strftime("%Y-%m-%d") if oi.estimated_delivery else None
        } for oi in items]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_orders_list(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        
        # In admin, we show OrderItems as it's more granular
        items = OrderItem.objects.all().select_related('product', 'vendor', 'order', 'order__customer', 'order__payment').order_by('-created_at')
        data = [{
            "id": f"#ORD-{oi.order.id:04d}", 
            "item_id": oi.id,
            "transaction_uuid": oi.order.payment.transaction_uuid if hasattr(oi.order, 'payment') else "N/A",
            "product": {"id": oi.product.id, "name": oi.product.name, "image": request.build_absolute_uri(oi.product.gallery.first().image.url) if oi.product.gallery.exists() else ""},
            "vendor": {"id": oi.vendor.id, "store_name": oi.vendor.store_name},
            "customer": {"id": oi.order.customer.id, "name": f"{oi.order.customer.first_name} {oi.order.customer.last_name}".strip() or oi.order.customer.username, "email": oi.order.customer.email},
            "amount": float(oi.total_amount), "status": oi.status, 
            "is_paid": oi.order.payment.payment_status == 'paid' if hasattr(oi.order, 'payment') else False,
            "payment_method": oi.order.payment.get_payment_method_display() if hasattr(oi.order, 'payment') else "N/A", 
            "payment_status": oi.order.payment.get_payment_status_display() if hasattr(oi.order, 'payment') else "N/A",
            "esewa_ref_id": oi.order.payment.esewa_ref_id if hasattr(oi.order, 'payment') else None,
            "date": oi.created_at.strftime("%Y-%m-%d %H:%M"), "shipping_address": oi.order.shipping_address,
            "commission": float(oi.commission_amount), "vendor_earning": float(oi.vendor_earning)
        } for oi in items]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def confirm_cod_payment(request, order_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff):
            return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
        
        try:
            processed_id = order_id
            if isinstance(order_id, str) and order_id.startswith("#ORD-"):
                processed_id = int(order_id.replace("#ORD-", ""))
            
            mo = MasterOrder.objects.get(id=processed_id)
            payment = mo.payment
            
            if payment.payment_method != 'COD':
                return JsonResponse({"error": "This action is only for Cash on Delivery orders."}, status=400)
            
            if mo.status != 'delivered':
                return JsonResponse({"error": "Payment can only be confirmed for delivered orders."}, status=400)
            
            if payment.payment_status == 'paid':
                return JsonResponse({"error": "This order is already marked as paid."}, status=400)

            payment.payment_status = 'paid'
            payment.save()
            
            # Update vendor balances for all items in this order
            for item in mo.items.all():
                if item.status == 'delivered':
                    vendor = item.vendor
                    vendor.pending_balance += item.vendor_earning
                    vendor.save()
            
            return JsonResponse({
                "message": "COD payment confirmed successfully",
                "payment_status": payment.get_payment_status_display(),
                "is_paid": True
            }, status=200)
            
        except MasterOrder.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)
        except Payment.DoesNotExist:
            return JsonResponse({"error": "Payment record not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid method"}, status=405)
