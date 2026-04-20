from django.http import JsonResponse
from django.db.models import Sum, Count, Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import date, timedelta
import json
import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.authtoken.models import Token
from .models import Vendor, VendorReview
from .serializers import VendorSerializer, VendorReviewSerializer
from products.models import Product
from orders.models import MasterOrder, OrderItem
from payments.models import Payment

def _get_vendor_from_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Token '):
        return None, JsonResponse({"error": "Unauthorized"}, status=401)
    token_key = auth_header.split(' ')[1]
    try:
        token = Token.objects.get(key=token_key)
        user = token.user
        if not hasattr(user, 'vendor_profile'):
            return None, JsonResponse({"error": "Vendor profile not found"}, status=404)
        if user.vendor_profile.status == 'suspended':
            return None, JsonResponse({"error": "Your vendor account is suspended."}, status=403)
        return user.vendor_profile, None
    except Token.DoesNotExist:
        return None, JsonResponse({"error": "Invalid token"}, status=401)

@csrf_exempt
def vendor_signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        store_name = data.get("storeName")
        phone = data.get("phone")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")
        zip_code = data.get("zipCode")

        from django.contrib.auth import get_user_model
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        from users.views import generate_otp
        otp = generate_otp()
        cache.set(f"signup_otp_{email}", otp, timeout=600)
        cache.set(f"signup_data_{email}", {
            "username": email, "email": email, "password": password,
            "first_name": first_name, "last_name": last_name, "role": "vendor",
            "store_name": store_name, "phone": phone, "address": address,
            "city": city, "state": state, "zip_code": zip_code
        }, timeout=600)

        try:
            send_mail(
                'Verify vendor account email', f'Your OTP is: {otp}',
                settings.EMAIL_HOST_USER, [email], fail_silently=False,
            )
        except Exception:
            return JsonResponse({"error": "Failed to send email"}, status=500)
        return JsonResponse({"message": "Verification code sent"}, status=201)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_profile(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        return JsonResponse({
            "store_name": vendor.store_name, "email": vendor.user.email,
            "first_name": vendor.user.first_name, "last_name": vendor.user.last_name,
            "role": vendor.role, "status": vendor.status, "admin_feedback": vendor.admin_feedback
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_pending_vendors(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff):
            return JsonResponse({"error": "Forbidden"}, status=403)
        vendors = Vendor.objects.filter(status='pending')
        data = [{
            "id": v.id, "store_name": v.store_name,
            "owner_name": f"{v.user.first_name} {v.user.last_name}".strip() or v.user.username,
            "email": v.user.email, "phone": v.phone, "joined": v.created_at.strftime("%Y-%m-%d"), "status": v.status
        } for v in vendors]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_update_vendor_status(request):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        data = json.loads(request.body)
        vendor_id, action = data.get("vendor_id"), data.get("action")
        admin_feedback = data.get("message", "")
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            if action == 'approve':
                vendor.status = 'approved'
                send_mail('Account Approved', 'Your account is approved.', settings.EMAIL_HOST_USER, [vendor.user.email], fail_silently=True)
            elif action == 'reject':
                vendor.status = 'rejected'
                send_mail('Account Rejected', 'Your account was rejected.', settings.EMAIL_HOST_USER, [vendor.user.email], fail_silently=True)
            elif action == 'suspend': vendor.status = 'suspended'
            elif action == 'unsuspend': vendor.status = 'approved'
            elif action == 'delete':
                vendor.user.delete()
                return JsonResponse({"message": "Deleted"}, status=200)
            vendor.admin_feedback = admin_feedback
            vendor.save()
            return JsonResponse({"message": f"{action} successful"}, status=200)
        except Vendor.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_dashboard_stats(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')

        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)

        stats = OrderItem.objects.filter(query).exclude(status='canceled').aggregate(
            total_rev=Sum('total_amount'), 
            total_earn=Sum('vendor_earning'),
            count=Count('id')
        )
        
        # Calculate growth percentage dynamically based on selected date range
        if from_date and to_date:
            try:
                start_dt = datetime.strptime(from_date, "%Y-%m-%d").date()
                end_dt = datetime.strptime(to_date, "%Y-%m-%d").date()
                delta = end_dt - start_dt
                
                # Previous period of equal length
                prev_end_dt = start_dt - timedelta(days=1)
                prev_start_dt = prev_end_dt - delta
                
                curr_period = OrderItem.objects.filter(
                    vendor=vendor, created_at__date__gte=start_dt, created_at__date__lte=end_dt
                ).exclude(status='canceled').aggregate(earn=Sum('vendor_earning'))
                
                prev_period = OrderItem.objects.filter(
                    vendor=vendor, created_at__date__gte=prev_start_dt, created_at__date__lte=prev_end_dt
                ).exclude(status='canceled').aggregate(earn=Sum('vendor_earning'))
                
                curr_earn = float(curr_period['earn'] or 0)
                prev_earn = float(prev_period['earn'] or 0)
            except ValueError:
                curr_earn = prev_earn = 0
        else:
            # Default to month-over-month for overall view
            now = timezone.now()
            month_start = now.replace(day=1)
            prev_month_end = month_start - timedelta(days=1)
            prev_month_start = prev_month_end.replace(day=1)
            
            curr_period = OrderItem.objects.filter(
                vendor=vendor, created_at__gte=month_start
            ).exclude(status='canceled').aggregate(earn=Sum('vendor_earning'), rev=Sum('total_amount'), comm=Sum('commission_amount'))
            
            prev_period = OrderItem.objects.filter(
                vendor=vendor, created_at__date__gte=prev_month_start, created_at__date__lte=prev_month_end
            ).exclude(status='canceled').aggregate(earn=Sum('vendor_earning'))
            
            curr_earn = float(curr_period['earn'] or 0)
            prev_earn = float(prev_period['earn'] or 0)

        if prev_earn > 0:
            mom_growth = round(((curr_earn - prev_earn) / prev_earn) * 100, 1)
        else:
            mom_growth = 100.0 if curr_earn > 0 else 0.0
            
        # Re-add this_month to satisfy the JsonResponse contract
        now_dt = timezone.now()
        month_start_dt = now_dt.replace(day=1)
        this_month = OrderItem.objects.filter(vendor=vendor, created_at__gte=month_start_dt).exclude(status='canceled').aggregate(
            earn=Sum('vendor_earning'),
            rev=Sum('total_amount'),
            comm=Sum('commission_amount')
        )
        
        # Calculate effective commission rate from actual data
        total_rev_all = float(stats['total_rev'] or 0)
        total_comm = OrderItem.objects.filter(query).exclude(status='canceled').aggregate(comm=Sum('commission_amount'))
        total_comm_val = float(total_comm['comm'] or 0)
        if total_rev_all > 0:
            effective_commission_rate = round((total_comm_val / total_rev_all) * 100, 1)
        else:
            effective_commission_rate = 5.0  # Default platform rate
        
        # Pending Payout: In-transit orders OR Delivered but Unpaid orders
        pending_q = query & (~Q(status__in=['delivered', 'canceled']) | Q(status='delivered', order__payment__payment_status='pending'))
        pending_stats = OrderItem.objects.filter(pending_q).aggregate(earn=Sum('vendor_earning'))
        
        # Available Balance: Delivered AND Paid orders pending payout
        available_q = query & Q(status='delivered', order__payment__payment_status='paid', payout_status='pending')
        available_stats = OrderItem.objects.filter(available_q).aggregate(earn=Sum('vendor_earning'))
        
        return JsonResponse({
            "total_revenue": float(stats['total_rev'] or 0), 
            "total_earnings": float(stats['total_earn'] or 0),
            "this_month_earnings": float(this_month['earn'] or 0),
            "this_month_revenue": float(this_month['rev'] or 0),
            "this_month_commission": float(this_month['comm'] or 0),
            "prev_month_earnings": prev_earn,
            "mom_growth": mom_growth,
            "commission_rate": effective_commission_rate,
            "pending_earnings": float(pending_stats['earn'] or 0),
            "paid_earnings": float(vendor.paid_balance),
            "available_balance": float(available_stats['earn'] or 0), # Calculated directly from DB for accuracy
            "total_orders": stats['count'] or 0,
            "products_listed": Product.objects.filter(vendor=vendor, is_active=True).count(),
            "pending_orders": OrderItem.objects.filter(vendor=vendor, status='pending').count(),
            "last_payout_date": vendor.last_payout_date.strftime("%Y-%m-%d") if vendor.last_payout_date else None,
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_recent_orders(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        orders = OrderItem.objects.filter(vendor=vendor).select_related('product', 'order__customer', 'order__payment').order_by('-created_at')[:5]
        data = [{
            "id": f"#ORD-{o.order.id:04d}", 
            "customer": f"{o.order.customer.first_name} {o.order.customer.last_name}".strip() or o.order.customer.username,
            "product": o.product.name, "amount": float(o.total_amount), "status": o.status, "date": o.created_at.strftime("%Y-%m-%d"),
            "payment_method": o.order.payment.get_payment_method_display() if hasattr(o.order, 'payment') else "N/A", 
            "payment_status": o.order.payment.get_payment_status_display() if hasattr(o.order, 'payment') else "N/A",
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_orders_list(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        orders = OrderItem.objects.filter(vendor=vendor).select_related('product', 'order__customer', 'order__payment').order_by('-created_at')
        data = [{
            "id": f"#ORD-{o.order.id:04d}", "raw_id": o.id, "customer": f"{o.order.customer.first_name} {o.order.customer.last_name}".strip() or o.order.customer.username,
            "product": o.product.name, "quantity": o.quantity, "amount": float(o.total_amount),
            "commission": float(o.commission_amount), "vendor_earning": float(o.vendor_earning),
            "status": o.status, "date": o.created_at.strftime("%Y-%m-%d"), "address": o.order.shipping_address,
            "payment_method": o.order.payment.get_payment_method_display() if hasattr(o.order, 'payment') else "N/A", 
            "payment_status": o.order.payment.get_payment_status_display() if hasattr(o.order, 'payment') else "N/A",
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_update_order_status(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            order_id = data.get("order_id") # Can be "#ORD-0001" or an integer ID
            if not order_id: return JsonResponse({"error": "Missing order reference"}, status=400)

            new_status = data.get("status")
            if new_status not in [c[0] for c in MasterOrder.STATUS_CHOICES]:
                return JsonResponse({"error": "Invalid status"}, status=400)

            # If it's a string starting with #ORD-, it's a MasterOrder ID reference
            if isinstance(order_id, str) and order_id.startswith("#ORD-"):
                mo_id = int(order_id.replace("#ORD-", ""))
                items = OrderItem.objects.filter(order_id=mo_id, vendor=vendor)
            else:
                # Otherwise assume it's a raw OrderItem ID
                items = OrderItem.objects.filter(id=order_id, vendor=vendor)

            if not items.exists():
                return JsonResponse({"error": "Order item not found"}, status=404)

            for order in items:
                if order.status == 'canceled': continue
                
                old_status = order.status
                order.status = new_status
                
                # If newly shipped, generate tracking info
                if new_status == 'shipped' and old_status != 'shipped':
                    order.generate_tracking()
                    order.shipped_at = timezone.now()
                    order.estimated_delivery = timezone.now() + timedelta(days=3)
                    
                    # Notify Customer of Shipment
                    try:
                        subject = f"Your order #{order.order.id:04d} has been shipped!"
                        message = (
                            f"Hi {order.order.customer.first_name or order.order.customer.username},\n\n"
                            f"Good news! Your order for '{order.product.name}' has been shipped and is on its way.\n\n"
                            f"--- Shipping Details ---\n"
                            f"Tracking ID: {order.tracking_id}\n"
                            f"Courier: {order.get_courier_name_display() if order.courier_name else 'Standard'}\n"
                            f"Est. Delivery: {order.estimated_delivery.strftime('%Y-%m-%d')}\n\n"
                            f"You can track your package directly from your profile page on GearUpNepal.\n\n"
                            f"Thank you for shopping with us!\n"
                            f"GearUpNepal Team"
                        )
                        send_mail(subject, message, settings.EMAIL_HOST_USER, [order.order.customer.email], fail_silently=True)
                    except Exception: pass
                
                # If newly delivered, add to pending balance ONLY if paid
                if new_status == 'delivered' and old_status != 'delivered':
                    if hasattr(order.order, 'payment') and order.order.payment.payment_status == 'paid':
                        vendor.pending_balance += order.vendor_earning
                        vendor.save()
                    
                    # Notify Customer of Delivery
                    try:
                        subject = f"Order #{order.order.id:04d} Delivered!"
                        message = (
                            f"Hi {order.order.customer.first_name or order.order.customer.username},\n\n"
                            f"Your order for '{order.product.name}' has been delivered successfully.\n\n"
                            f"We hope you love your new gear! If you have a moment, we'd love to hear your thoughts. "
                            f"You can rate the product and the vendor on your profile page.\n\n"
                            f"Thank you for choosing GearUpNepal!\n"
                            f"GearUpNepal Team"
                        )
                        send_mail(subject, message, settings.EMAIL_HOST_USER, [order.order.customer.email], fail_silently=True)
                    except Exception: pass
                
                # If status changed FROM delivered
                elif old_status == 'delivered' and new_status != 'delivered':
                    if hasattr(order.order, 'payment') and order.order.payment.payment_status == 'paid' and order.payout_status == 'pending':
                        vendor.pending_balance = max(0, vendor.pending_balance - order.vendor_earning)
                        vendor.save()

                if new_status == 'canceled':
                    order.vendor_earning = 0
                    order.commission_amount = 0

                order.save()

                # Sync MasterOrder and Payment if EVERYTHING is canceled
                mo = order.order
                if new_status == 'canceled':
                    all_canceled = not mo.items.exclude(status='canceled').exists()
                    if all_canceled:
                        mo.status = 'canceled'
                        mo.save()
                        Payment.objects.filter(order=mo).update(payment_status='canceled')

            return JsonResponse({"message": "Updated successfully"}, status=200)
            return JsonResponse({"error": "Invalid status"}, status=400)
        except OrderItem.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_sales_chart(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        chart_data = []
        
        if from_date and to_date:
            start_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            delta = end_date - start_date
            
            for i in range(delta.days + 1):
                day = start_date + timedelta(days=i)
                aggr = OrderItem.objects.filter(vendor=vendor, created_at__date=day).exclude(status='canceled').aggregate(
                    total=Sum('total_amount'), 
                    earn=Sum('vendor_earning'),
                    count=Count('id')
                )
                chart_data.append({
                    "day": day.strftime("%d %b"), 
                    "sales": float(aggr['total'] or 0), 
                    "earnings": float(aggr['earn'] or 0),
                    "orders": aggr['count']
                })
        else:
            # Default to past 7 days (weekly)
            today = date.today()
            for i in range(6, -1, -1):
                day = today - timedelta(days=i)
                aggr = OrderItem.objects.filter(vendor=vendor, created_at__date=day).exclude(status='canceled').aggregate(
                    total=Sum('total_amount'), 
                    earn=Sum('vendor_earning'),
                    count=Count('id')
                )
                chart_data.append({
                    "day": day.strftime("%a"), 
                    "sales": float(aggr['total'] or 0), 
                    "earnings": float(aggr['earn'] or 0),
                    "orders": aggr['count']
                })
        return JsonResponse(chart_data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_category_chart(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)

        cats = OrderItem.objects.filter(query).exclude(status='canceled').values('product__category__name').annotate(
            value=Sum('total_amount')
        ).order_by('-value')
        data = [
            {
                "name": c['product__category__name'].capitalize() if c['product__category__name'] else "Other", 
                "value": float(c['value'] or 0)
            } for c in cats if (c['value'] or 0) > 0
        ]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_vendors_list(request):
    from users.views import _get_user_from_token
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    
    # Financial Query
    f_query = ~Q(status='canceled')
    if from_date:
        f_query &= Q(created_at__date__gte=from_date)
    if to_date:
        f_query &= Q(created_at__date__lte=to_date)

    # Payout Query (for payments released within this period)
    p_query = Q(payout_status='paid')
    if from_date:
        p_query &= Q(payout_date__date__gte=from_date)
    if to_date:
        p_query &= Q(payout_date__date__lte=to_date)

    # Use Subqueries to prevent join explosion (Cartesian product)
    from django.db.models import OuterRef, Subquery
    
    vendor_revenues = OrderItem.objects.filter(f_query, vendor=OuterRef('pk')).values('vendor').annotate(total=Sum('total_amount')).values('total')
    vendor_commissions = OrderItem.objects.filter(f_query, vendor=OuterRef('pk')).values('vendor').annotate(total=Sum('commission_amount')).values('total')
    vendor_payouts = OrderItem.objects.filter(f_query, vendor=OuterRef('pk')).values('vendor').annotate(total=Sum('vendor_earning')).values('total')
    vendor_period_paid = OrderItem.objects.filter(p_query, vendor=OuterRef('pk')).values('vendor').annotate(total=Sum('vendor_earning')).values('total')

    vendors = Vendor.objects.all().annotate(
        product_count=Count('products', distinct=True),
        total_revenue=Subquery(vendor_revenues[:1]),
        total_commission=Subquery(vendor_commissions[:1]),
        total_payout=Subquery(vendor_payouts[:1]),
        period_paid_total=Subquery(vendor_period_paid[:1])
    ).order_by('-created_at')
    
    data = [{
        "id": v.id, "store_name": v.store_name, "owner_name": f"{v.user.first_name} {v.user.last_name}".strip() or v.user.username,
        "email": v.user.email, "phone": v.phone, "address": v.address, "products": v.product_count or 0,
        "revenue": float(v.total_revenue or 0), "commission": float(v.total_commission or 0),
        "payout": float(v.total_payout or 0), "status": v.status, "joined": v.created_at.strftime("%Y-%m-%d"),
        "pending_balance": float(v.pending_balance),
        "paid_balance": float(v.paid_balance),
        "period_paid": float(v.period_paid_total or 0) if (from_date or to_date) else float(v.paid_balance),
        "last_payout_date": v.last_payout_date.strftime("%Y-%m-%d") if v.last_payout_date else None,
        "is_eligible": (not v.last_payout_date or (timezone.now() - v.last_payout_date).days >= 7) and v.pending_balance > 0
    } for v in vendors]
    return JsonResponse(data, safe=False, status=200)

@csrf_exempt
def public_vendor_detail(request, vendor_id):
    if request.method == "GET":
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            products = Product.objects.filter(vendor=vendor, is_active=True).order_by('-created_at')
            p_data = [{
                "id": p.id, "name": p.name, "price": float(p.price),
                "image": request.build_absolute_uri(p.gallery.first().image.url) if p.gallery.exists() and p.gallery.first().image else "",
                "category": p.category.name if p.category else "Uncategorized",
            } for p in products]
            v_reviews = VendorReview.objects.filter(vendor=vendor).order_by('-created_at')
            return JsonResponse({
                "id": vendor.id, "store_name": vendor.store_name,
                "owner_name": f"{vendor.user.first_name} {vendor.user.last_name}".strip() or vendor.user.username,
                "email": vendor.user.email, "phone": vendor.phone, "address": vendor.address, "city": vendor.city,
                "status": vendor.status, "products": p_data, "products_count": len(p_data),
                "average_rating": vendor.average_rating, "review_count": vendor.review_count,
                "vendor_reviews": VendorReviewSerializer(v_reviews, many=True).data,
                "service_rating": vendor.service_rating
            }, status=200)
        except Vendor.DoesNotExist: return JsonResponse({"error": "Vendor not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def submit_vendor_review(request, vendor_id, order_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            order = OrderItem.objects.get(id=order_id, order__customer=user, vendor=vendor)
            if order.status != 'delivered':
                return JsonResponse({"error": "Only delivered orders can be rated"}, status=403)
            data = json.loads(request.body)
            review, created = VendorReview.objects.update_or_create(
                customer=user, vendor=vendor, order=order,
                defaults={'rating': data.get('rating'), 'comment': data.get('comment', '')}
            )
            return JsonResponse({"message": "Submitted", "review": VendorReviewSerializer(review).data}, status=201 if created else 200)
        except (Vendor.DoesNotExist, OrderItem.DoesNotExist): return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def check_vendor_review_eligibility(request, vendor_id, order_id):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return JsonResponse({"can_review": False, "reason": "login_required"}, status=200)
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            order = OrderItem.objects.get(id=order_id, order__customer=user, vendor=vendor)
            existing = VendorReview.objects.filter(customer=user, vendor=vendor, order_id=order_id).first()
            return JsonResponse({
                "can_review": order.status == 'delivered',
                "existing_review": VendorReviewSerializer(existing).data if existing else None
            }, status=200)
        except (Vendor.DoesNotExist, OrderItem.DoesNotExist): return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_dashboard_stats(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        from django.contrib.auth import get_user_model
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        User = get_user_model()
        
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q()
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)

        stats = OrderItem.objects.filter(query).exclude(status='canceled').aggregate(
            total_rev=Sum('total_amount'), 
            total_comm=Sum('commission_amount'), 
            count=Count('id')
        )
        
        # Calculate revenue trend
        revenue_trend = []
        if from_date and to_date:
            start_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            delta = end_date - start_date
            
            for i in range(delta.days + 1):
                day = start_date + timedelta(days=i)
                day_stats = OrderItem.objects.filter(created_at__date=day).exclude(status='canceled').aggregate(
                    rev=Sum('total_amount'), 
                    orders=Count('id')
                )
                revenue_trend.append({
                    "name": day.strftime("%d %b"), 
                    "revenue": float(day_stats['rev'] or 0), 
                    "orders": day_stats['orders'] or 0
                })
        else:
            # Default past 7 days
            today = date.today()
            for i in range(6, -1, -1):
                day = today - timedelta(days=i)
                day_stats = OrderItem.objects.filter(created_at__date=day).exclude(status='canceled').aggregate(
                    rev=Sum('total_amount'), 
                    orders=Count('id')
                )
                revenue_trend.append({
                    "name": day.strftime("%a"), 
                    "revenue": float(day_stats['rev'] or 0), 
                    "orders": day_stats['orders'] or 0
                })

        # Vendor categories distribution
        cats = Product.objects.filter(is_active=True).values('category__name').annotate(count=Count('id')).order_by('-count')[:4]
        vendor_categories = []
        for c in cats:
            vendor_categories.append({
                "name": c['category__name'].capitalize() if c['category__name'] else "Other",
                "value": c['count'] or 0
            })
            
        return JsonResponse({
            "total_users": User.objects.count(), "active_vendors": Vendor.objects.filter(status='approved').count(),
            "pending_approvals": Vendor.objects.filter(status='pending').count(),
            "total_revenue": float(stats['total_rev'] or 0), "total_commission": float(stats['total_comm'] or 0),
            "total_orders": stats['count'] or 0,
            "revenue_trend": revenue_trend,
            "vendor_categories": vendor_categories
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_top_vendors(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        top = Vendor.objects.filter(status='approved').annotate(
            revenue=Sum('order_items__total_amount', filter=~Q(order_items__status='canceled')),
            commission=Sum('order_items__commission_amount', filter=~Q(order_items__status='canceled')),
            payout=Sum('order_items__vendor_earning', filter=~Q(order_items__status='canceled')),
            count=Count('order_items', filter=~Q(order_items__status='canceled'))
        ).order_by('-revenue')[:4]
        return JsonResponse([
            {
                "name": v.store_name, 
                "revenue": float(v.revenue or 0), 
                "commission": float(v.commission or 0),
                "payout": float(v.payout or 0), 
                "orders": v.count or 0, 
                "rating": float(v.average_rating)
            } for v in top
        ], safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_recent_activities(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        from django.contrib.auth import get_user_model
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        limit = int(request.GET.get('limit', 5))
        acts = []
        for p in Product.objects.all().select_related('vendor').order_by('-created_at')[:limit]:
            acts.append({"type": "vendor", "action": f"{p.vendor.store_name} added: {p.name}", "timestamp": p.created_at, "color": "bg-gray-900"})
        for o in OrderItem.objects.all().order_by('-created_at')[:limit]:
            acts.append({"type": "order", "action": f"Order #ORD-{o.order.id:04d} item: {o.product.name}", "timestamp": o.created_at, "color": "bg-accent"})
        User = get_user_model()
        for u in User.objects.filter(role='customer').order_by('-date_joined')[:limit]:
            acts.append({"type": "user", "action": f"New customer: {u.username}", "timestamp": u.date_joined, "color": "bg-gray-400"})
        acts.sort(key=lambda x: x['timestamp'], reverse=True)
        now = timezone.now()
        for a in acts:
            diff = now - a['timestamp']
            sec = diff.total_seconds()
            if sec < 60: a['time'] = "Just now"
            elif sec < 3600: a['time'] = f"{int(sec/60)}m ago"
            elif sec < 86400: a['time'] = f"{int(sec/3600)}h ago"
            else: a['time'] = f"{int(sec/86400)}d ago"
            del a['timestamp']
        return JsonResponse(acts, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_reports_stats(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        from django.contrib.auth import get_user_model
        from django.db.models.functions import TruncMonth
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        totals = OrderItem.objects.aggregate(rev=Sum('total_amount'), comm=Sum('commission_amount'))
        User = get_user_model()
        now = timezone.now()
        start = (now - timedelta(days=210)).replace(day=1)
        history = OrderItem.objects.filter(created_at__gte=start).annotate(month=TruncMonth('created_at')).values('month').annotate(revenue=Sum('total_amount'), commission=Sum('commission_amount'), count=Count('id')).order_by('month')
        monthly_data = []
        month_map = {h['month'].strftime('%b').upper(): h for h in history}
        for i in range(6, -1, -1):
            m_name = (now - timedelta(days=30*i)).strftime('%b').upper()
            m_d = month_map.get(m_name, {'revenue': 0, 'commission': 0, 'count': 0})
            monthly_data.append({"month": m_name, "revenue": float(m_d['revenue']), "commission": float(m_d['commission']), "orders": m_d['count']})
        cats = OrderItem.objects.values('product__category__name').annotate(rev=Sum('total_amount')).order_by('-rev')
        cat_rev_total = sum(float(c['rev'] or 0) for c in cats) or 1
        cat_breakdown = [{"category": c['product__category__name'].capitalize() if c['product__category__name'] else "Other", "revenue": float(c['rev']), "percentage": round((float(c['rev'])/cat_rev_total)*100)} for c in cats]
        return JsonResponse({
            "platform_yield": {"total": float(totals['rev'] or 0), "growth": 14.2}, "platform_commission": {"total": float(totals['comm'] or 0), "growth": 12.5},
            "total_orders": {"total": OrderItem.objects.count(), "growth": 8.7}, "identity_base": {"total": User.objects.filter(role='customer').count(), "growth": 22.4},
            "monthly_revenue": monthly_data, "category_breakdown": cat_breakdown or [{"category": "Other", "revenue": 0, "percentage": 0}]
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_report_sales(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        orders = OrderItem.objects.filter(query).select_related('product', 'order__customer').order_by('-created_at')
        data = [{
            "id": f"#ORD-{o.order.id:04d}", 
            "product": o.product.name,
            "gross_amount": float(o.total_amount),
            "commission": float(o.commission_amount),
            "net_earning": float(o.vendor_earning),
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d")
        } for o in orders]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_report_customers(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        customers = OrderItem.objects.filter(query).values('order__customer__username', 'order__customer__first_name', 'order__customer__last_name', 'order__customer__email').annotate(
            order_count=Count('id'),
            total_spend=Sum('total_amount')
        ).order_by('-total_spend')
        
        data = [{
            "customer": f"{c['order__customer__first_name']} {c['order__customer__last_name']}".strip() or c['order__customer__username'],
            "email": c['order__customer__email'],
            "order_count": c['order_count'],
            "total_lifetime_value": float(c['total_spend'] or 0)
        } for c in customers]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_report_orders(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        orders = OrderItem.objects.filter(query).select_related('order__customer', 'product').order_by('-created_at')
        data = [{
            "order_id": f"#ORD-{o.order.id:04d}",
            "customer": f"{o.order.customer.first_name} {o.order.customer.last_name}".strip() or o.order.customer.username,
            "items_count": o.quantity,
            "total_price": float(o.total_amount),
            "status": o.status,
            "payment_method": o.order.payment.get_payment_method_display() if hasattr(o.order, 'payment') else "N/A",
            "date": o.created_at.strftime("%Y-%m-%d")
        } for o in orders]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_report_products(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q(vendor=vendor)
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        # Group by product
        products = OrderItem.objects.filter(query).exclude(status='canceled').values('product__name').annotate(
            units_sold=Sum('quantity'),
            total_revenue=Sum('total_amount')
        ).order_by('-units_sold')
        
        data = [{
            "product_name": p['product__name'],
            "units_sold": p['units_sold'],
            "total_revenue": float(p['total_revenue'])
        } for p in products]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_report_sales(request):
    from users.views import _get_user_from_token
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q()
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        stats = OrderItem.objects.filter(query).exclude(status='canceled').aggregate(
            total_orders=Count('id'),
            total_revenue=Sum('total_amount'),
            total_commission=Sum('commission_amount'),
            total_vendor_earnings=Sum('vendor_earning')
        )
        
        # Calculate Trend
        from datetime import datetime
        revenue_trend = []
        if from_date and to_date:
            try:
                start_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                delta = end_date - start_date
                
                for i in range(delta.days + 1):
                    day = start_date + timedelta(days=i)
                    day_stats = OrderItem.objects.filter(created_at__date=day).exclude(status='canceled').aggregate(
                        rev=Sum('total_amount'),
                        comm=Sum('commission_amount')
                    )
                    revenue_trend.append({
                        "date": day.strftime("%d %b"),
                        "revenue": float(day_stats['rev'] or 0),
                        "commission": float(day_stats['comm'] or 0)
                    })
            except Exception:
                pass
        
        if not revenue_trend:
            # Default to last 7 days if no dates or processing failed
            today = date.today()
            for i in range(6, -1, -1):
                day = today - timedelta(days=i)
                day_stats = OrderItem.objects.filter(created_at__date=day).exclude(status='canceled').aggregate(
                    rev=Sum('total_amount'),
                    comm=Sum('commission_amount')
                )
                revenue_trend.append({
                    "date": day.strftime("%d %b"),
                    "revenue": float(day_stats['rev'] or 0),
                    "commission": float(day_stats['comm'] or 0)
                })
        
        # Filtering for annotations
        v_query = Q()
        if from_date:
            v_query &= Q(order_items__created_at__date__gte=from_date)
        if to_date:
            v_query &= Q(order_items__created_at__date__lte=to_date)
            
        # Fetch Top Vendors within the date range
        top_vendors = Vendor.objects.filter(status='approved').annotate(
            revenue=Sum('order_items__total_amount', filter=v_query & ~Q(order_items__status='canceled')),
            orders=Count('order_items', filter=v_query & ~Q(order_items__status='canceled'))
        ).filter(revenue__gt=0).order_by('-revenue')[:5]
        
        vendors_data = [{
            "name": v.store_name,
            "revenue": float(v.revenue or 0),
            "orders": v.orders or 0
        } for v in top_vendors]
        
        return JsonResponse({
            "total_orders": stats['total_orders'] or 0,
            "total_revenue": float(stats['total_revenue'] or 0),
            "total_admin_commission": float(stats['total_commission'] or 0),
            "total_vendor_earnings": float(stats['total_vendor_earnings'] or 0),
            "top_vendors": vendors_data,
            "revenue_trend": revenue_trend
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_report_orders(request):
    from users.views import _get_user_from_token
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q()
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        orders = OrderItem.objects.filter(query).select_related('order__customer', 'order__payment', 'product').order_by('-created_at')
        data = [{
            "order_id": f"#ORD-{o.id:04d}",
            "customer_name": f"{o.order.customer.first_name} {o.order.customer.last_name}".strip() or o.order.customer.username,
            "customer_email": o.order.customer.email,
            "items_count": o.quantity,
            "total_amount": float(o.total_amount),
            "status": o.status,
            "payment_method": o.order.payment.get_payment_method_display() if hasattr(o.order, 'payment') else "N/A",
            "date": o.created_at.strftime("%Y-%m-%d")
        } for o in orders]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_report_products(request):
    from users.views import _get_user_from_token
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        query = Q()
        if from_date:
            query &= Q(created_at__date__gte=from_date)
        if to_date:
            query &= Q(created_at__date__lte=to_date)
            
        products = OrderItem.objects.filter(query).exclude(status='canceled').values(
            'product__name', 'vendor__store_name'
        ).annotate(
            units_sold=Sum('quantity'),
            total_revenue=Sum('total_amount')
        ).order_by('-units_sold')
        
        data = [{
            "product_name": p['product__name'],
            "vendor_name": p['vendor__store_name'],
            "units_sold": p['units_sold'],
            "total_revenue": float(p['total_revenue'])
        } for p in products]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_report_customers(request):
    from users.views import _get_user_from_token
    from django.contrib.auth import get_user_model
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    
    if request.method == "GET":
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        
        User = get_user_model()
        
        # Filtering orders for aggregation
        order_query = Q()
        if from_date:
            order_query &= Q(master_orders__created_at__date__gte=from_date)
        if to_date:
            order_query &= Q(master_orders__created_at__date__lte=to_date)
            
        # We want all customers who have placed orders in the range
        customers = User.objects.filter(role='customer').annotate(
            total_orders_count=Count('master_orders', filter=order_query, distinct=True),
            total_spending_amt=Sum('master_orders__total_amount', filter=order_query)
        ).filter(total_orders_count__gt=0).order_by('-total_spending_amt')
        
        data = [{
            "customer_name": f"{c.first_name} {c.last_name}".strip() or c.username,
            "total_orders": c.total_orders_count,
            "total_spending": float(c.total_spending_amt or 0)
        } for c in customers]
        
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_release_weekly_payouts(request):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)

        data = json.loads(request.body) if request.body else {}
        otp = data.get("otp")
        admin_email = "gauravbhujel036@gmail.com"
        
        # Phase 1: OTP Generation & Sending
        if not otp:
            from users.views import generate_otp
            token = generate_otp()
            cache.set(f"payout_otp_{admin_email}", token, timeout=600)  # 10 minutes
            
            try:
                subject = "Payout Authorization Required - GearUpNepal"
                message = (
                    f"Hello Admin,\n\n"
                    f"A request has been initiated to release weekly payouts to eligible vendors.\n\n"
                    f"Your Authorization Code: {token}\n\n"
                    f"If you did not initiate this request, please investigate immediately.\n\n"
                    f"Thank you,\n"
                    f"GearUpNepal Security"
                )
                send_mail(subject, message, settings.EMAIL_HOST_USER, [admin_email], fail_silently=False)
                return JsonResponse({"otp_required": True, "message": "Verification code sent to your email."}, status=200)
            except Exception as e:
                return JsonResponse({"error": f"Failed to send verification email: {str(e)}"}, status=500)

        # Phase 2: OTP Verification
        cached_otp = cache.get(f"payout_otp_{admin_email}")
        if not cached_otp or cached_otp != str(otp):
            return JsonResponse({"error": "Invalid or expired authorization code."}, status=400)

        # Phase 3: Execute Payout Logic
        now = timezone.now()
        vendors = Vendor.objects.all()
        released_count = 0
        total_released_amount = 0
        
        from django.db import transaction
        with transaction.atomic():
            for vendor in vendors:
                # Check 7-day rule
                is_eligible = not vendor.last_payout_date or (now - vendor.last_payout_date).days >= 7
                if is_eligible and vendor.pending_balance > 0:
                    amount = vendor.pending_balance
                    # Move balance
                    vendor.paid_balance += amount
                    vendor.pending_balance = 0
                    vendor.last_payout_date = now
                    vendor.save()
                    
                    # Update related orders
                    Order.objects.filter(
                        vendor=vendor, 
                        status='delivered', 
                        payout_status='pending'
                    ).update(payout_status='paid', payout_date=now)
                    
                    released_count += 1
                    total_released_amount += amount
            
            # Clear OTP after successful payout
            cache.delete(f"payout_otp_{admin_email}")
                    
        return JsonResponse({
            "message": f"Successfully released payouts for {released_count} vendors.",
            "total_amount": float(total_released_amount)
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

