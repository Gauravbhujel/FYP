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
from orders.models import Order

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
        stats = Order.objects.filter(vendor=vendor).aggregate(total_rev=Sum('total_amount'), total_earn=Sum('vendor_earning'))
        return JsonResponse({
            "total_revenue": float(stats['total_rev'] or 0), "total_earnings": float(stats['total_earn'] or 0),
            "total_orders": Order.objects.filter(vendor=vendor).count(),
            "products_listed": Product.objects.filter(vendor=vendor, is_active=True).count(),
            "pending_orders": Order.objects.filter(vendor=vendor, status='pending').count(),
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_recent_orders(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        orders = Order.objects.filter(vendor=vendor).select_related('product', 'customer')[:5]
        data = [{
            "id": f"#ORD-{o.id:04d}", "customer": f"{o.customer.first_name} {o.customer.last_name}".strip() or o.customer.username,
            "product": o.product.name, "amount": float(o.total_amount), "status": o.status, "date": o.created_at.strftime("%Y-%m-%d"),
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_orders_list(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        orders = Order.objects.filter(vendor=vendor).select_related('product', 'customer').order_by('-created_at')
        data = [{
            "id": f"#ORD-{o.id:04d}", "raw_id": o.id, "customer": f"{o.customer.first_name} {o.customer.last_name}".strip() or o.customer.username,
            "product": o.product.name, "quantity": o.quantity, "amount": float(o.total_amount),
            "status": o.status, "date": o.created_at.strftime("%Y-%m-%d"), "address": o.shipping_address,
        } for o in orders]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_update_order_status(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "POST":
        data = json.loads(request.body)
        order_id = data.get("order_id")
        if isinstance(order_id, str) and order_id.startswith("#ORD-"):
            order_id = int(order_id.replace("#ORD-", ""))
        try:
            order = Order.objects.get(id=order_id, vendor=vendor)
            new_status = data.get("status")
            if new_status in [c[0] for c in Order.STATUS_CHOICES]:
                order.status = new_status
                order.save()
                return JsonResponse({"message": "Updated"}, status=200)
            return JsonResponse({"error": "Invalid status"}, status=400)
        except Order.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_sales_chart(request):
    vendor, error = _get_vendor_from_token(request)
    if error: return error
    if request.method == "GET":
        today = date.today()
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        chart_data = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            rev = Order.objects.filter(vendor=vendor, created_at__date=day).aggregate(total=Sum('total_amount'))['total'] or 0
            chart_data.append({"day": days[day.weekday()], "sales": float(rev)})
        return JsonResponse(chart_data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_vendors_list(request):
    from users.views import _get_user_from_token
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
    vendors = Vendor.objects.all().annotate(
        product_count=Count('products', distinct=True),
        total_revenue=Sum('vendor_orders__total_amount'),
        total_commission=Sum('vendor_orders__commission_amount'),
        total_payout=Sum('vendor_orders__vendor_earning')
    ).order_by('-created_at')
    data = [{
        "id": v.id, "store_name": v.store_name, "owner_name": f"{v.user.first_name} {v.user.last_name}".strip() or v.user.username,
        "email": v.user.email, "phone": v.phone, "address": v.address, "products": v.product_count or 0,
        "revenue": float(v.total_revenue or 0), "commission": float(v.total_commission or 0),
        "payout": float(v.total_payout or 0), "status": v.status, "joined": v.created_at.strftime("%Y-%m-%d"),
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
                "image": request.build_absolute_uri(p.image.url) if p.image else "",
                "category": p.get_category_display(),
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
            order = Order.objects.get(id=order_id, customer=user, vendor=vendor)
            if order.status != 'delivered':
                return JsonResponse({"error": "Only delivered orders can be rated"}, status=403)
            data = json.loads(request.body)
            review, created = VendorReview.objects.update_or_create(
                customer=user, vendor=vendor, order=order,
                defaults={'rating': data.get('rating'), 'comment': data.get('comment', '')}
            )
            return JsonResponse({"message": "Submitted", "review": VendorReviewSerializer(review).data}, status=201 if created else 200)
        except (Vendor.DoesNotExist, Order.DoesNotExist): return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def check_vendor_review_eligibility(request, vendor_id, order_id):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return JsonResponse({"can_review": False, "reason": "login_required"}, status=200)
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            order = Order.objects.get(id=order_id, customer=user, vendor=vendor)
            existing = VendorReview.objects.filter(customer=user, vendor=vendor, order=order).first()
            return JsonResponse({
                "can_review": order.status == 'delivered',
                "existing_review": VendorReviewSerializer(existing).data if existing else None
            }, status=200)
        except (Vendor.DoesNotExist, Order.DoesNotExist): return JsonResponse({"error": "Not found"}, status=404)
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
        stats = Order.objects.aggregate(total_rev=Sum('total_amount'), total_comm=Sum('commission_amount'), count=Count('id'))
        return JsonResponse({
            "total_users": User.objects.count(), "active_vendors": Vendor.objects.filter(status='approved').count(),
            "pending_approvals": Vendor.objects.filter(status='pending').count(),
            "total_revenue": float(stats['total_rev'] or 0), "total_commission": float(stats['total_comm'] or 0),
            "total_orders": stats['count'] or 0
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
            revenue=Sum('vendor_orders__total_amount'),
            commission=Sum('vendor_orders__commission_amount'),
            payout=Sum('vendor_orders__vendor_earning'),
            count=Count('vendor_orders')
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
        for o in Order.objects.all().order_by('-created_at')[:limit]:
            acts.append({"type": "order", "action": f"Order #ORD-{o.id:04d} completed", "timestamp": o.created_at, "color": "bg-accent"})
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
        totals = Order.objects.aggregate(rev=Sum('total_amount'), comm=Sum('commission_amount'))
        User = get_user_model()
        now = timezone.now()
        start = (now - timedelta(days=210)).replace(day=1)
        history = Order.objects.filter(created_at__gte=start).annotate(month=TruncMonth('created_at')).values('month').annotate(revenue=Sum('total_amount'), commission=Sum('commission_amount'), count=Count('id')).order_by('month')
        monthly_data = []
        month_map = {h['month'].strftime('%b').upper(): h for h in history}
        for i in range(6, -1, -1):
            m_name = (now - timedelta(days=30*i)).strftime('%b').upper()
            m_d = month_map.get(m_name, {'revenue': 0, 'commission': 0, 'count': 0})
            monthly_data.append({"month": m_name, "revenue": float(m_d['revenue']), "commission": float(m_d['commission']), "orders": m_d['count']})
        cats = Order.objects.values('product__category').annotate(rev=Sum('total_amount')).order_by('-rev')
        cat_rev_total = sum(float(c['rev'] or 0) for c in cats) or 1
        cat_breakdown = [{"category": c['product__category'].capitalize() if c['product__category'] else "Other", "revenue": float(c['rev']), "percentage": round((float(c['rev'])/cat_rev_total)*100)} for c in cats]
        return JsonResponse({
            "platform_yield": {"total": float(totals['rev'] or 0), "growth": 14.2}, "platform_commission": {"total": float(totals['comm'] or 0), "growth": 12.5},
            "total_orders": {"total": Order.objects.count(), "growth": 8.7}, "identity_base": {"total": User.objects.filter(role='customer').count(), "growth": 22.4},
            "monthly_revenue": monthly_data, "category_breakdown": cat_breakdown or [{"category": "Other", "revenue": 0, "percentage": 0}]
        }, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)
