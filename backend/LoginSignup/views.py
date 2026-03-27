from django.http import JsonResponse
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
import json
import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum, Count, Q
from datetime import date
from rest_framework.authtoken.models import Token
from .models import CustomUser, Vendor, Product, Order, CartItem, WishlistItem, ProductReview
from .serializers import (
    ProductSerializer, UserProfileSerializer, VendorSerializer, 
    CartItemSerializer, WishlistItemSerializer, ProductReviewSerializer
)

def generate_otp():
    return str(random.randint(100000, 999999))

User = get_user_model()



@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"error": "Username already exists"},
                status=400
            )

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"error": "Email already exists"},
                status=400
            )

        otp = generate_otp()
        cache.set(f"signup_otp_{email}", otp, timeout=600)
        cache.set(f"signup_data_{email}", {
            "username": username,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "role": "customer"
        }, timeout=600)

        try:
            send_mail(
                'Verify your email',
                f'Your OTP for GearUpNepal registration is: {otp}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            print("Failed to send email:", e)
            return JsonResponse({"error": "Failed to send email. Check SMTP settings."}, status=500)

        return JsonResponse(
            {"message": "Verification code sent to your email."},
            status=201
        )

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_signup(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("email") # Use email as username for simplicity, or generate one
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        
        # Vendor specific fields
        store_name = data.get("storeName")
        phone = data.get("phone")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")
        zip_code = data.get("zipCode")

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"error": "Email already exists"},
                status=400
            )

        otp = generate_otp()
        cache.set(f"signup_otp_{email}", otp, timeout=600)
        cache.set(f"signup_data_{email}", {
            "username": email,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "role": "vendor",
            "store_name": store_name,
            "phone": phone,
            "address": address,
            "city": city,
            "state": state,
            "zip_code": zip_code
        }, timeout=600)

        try:
            send_mail(
                'Verify your vendor account email',
                f'Your OTP for GearUpNepal Vendor registration is: {otp}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            print("Failed to send email:", e)
            return JsonResponse({"error": "Failed to send email. Check SMTP settings."}, status=500)

        return JsonResponse(
            {"message": "Verification code sent to your email."},
            status=201
        )

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def verify_email(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")

        if not email or not otp:
            return JsonResponse({"error": "Email and OTP are required"}, status=400)

        cached_otp = cache.get(f"signup_otp_{email}")
        
        if not cached_otp:
            # Maybe the user is already verified?
            try:
                user = User.objects.get(email=email)
                if user.is_active:
                    return JsonResponse({"message": "Email is already verified"}, status=200)
            except User.DoesNotExist:
                pass
            return JsonResponse({"error": "OTP has expired or is invalid. Please sign up again."}, status=400)

        if cached_otp == otp:
            data = cache.get(f"signup_data_{email}")
            if not data:
                return JsonResponse({"error": "Registration data not found. Please sign up again."}, status=400)

            try:
                user = User.objects.create_user(
                    username=data["username"],
                    email=data["email"],
                    password=data["password"],
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    role=data["role"]
                )

                if data["role"] == "vendor":
                    Vendor.objects.create(
                        user=user,
                        store_name=data.get("store_name"),
                        phone=data.get("phone"),
                        address=data.get("address"),
                        city=data.get("city"),
                        state=data.get("state"),
                        zip_code=data.get("zip_code")
                    )

                cache.delete(f"signup_otp_{email}")
                cache.delete(f"signup_data_{email}")

                return JsonResponse({"message": "Email verified and account created successfully!"}, status=200)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        else:
            return JsonResponse({"error": "Invalid OTP"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

from rest_framework.authtoken.models import Token

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:
            user_obj = User.objects.get(email=email)
            if not user_obj.is_active:
                return JsonResponse({"error": "Please verify your email before logging in"}, status=403)
                
            user = authenticate(username=user_obj.username, password=password)
            if user:
                # Check if user is suspended
                if user.is_suspended():
                    remaining = user.suspended_until - timezone.now()
                    hours_left = int(remaining.total_seconds() // 3600)
                    mins_left = int((remaining.total_seconds() % 3600) // 60)
                    return JsonResponse({
                        "error": f"Your account is suspended. Try again in {hours_left}h {mins_left}m."
                    }, status=403)
                
                if hasattr(user, 'vendor_profile') and user.vendor_profile.status == 'suspended':
                    return JsonResponse({
                        "error": "Your vendor account is suspended."
                    }, status=403)
                
                token, _ = Token.objects.get_or_create(user=user)
                
                role = user.role
                if user.is_superuser:
                    role = "admin"
                
                return JsonResponse({"message": "Login successful", "token": token.key, "role": role}, status=200)
            else:
                return JsonResponse({"error": "Incorrect password"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=405)



@csrf_exempt
def vendor_profile(request):
    if request.method == "GET":
        # Extract token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if hasattr(user, 'vendor_profile'):
                vendor = user.vendor_profile
                return JsonResponse({
                    "store_name": vendor.store_name,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": vendor.role,
                    "status": vendor.status,
                    "admin_feedback": vendor.admin_feedback
                }, status=200)
            else:
                return JsonResponse({"error": "Vendor profile not found"}, status=404)
        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_pending_vendors(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            # Check if user is superuser or staff
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            pending_vendors = Vendor.objects.filter(status='pending')
            vendors_data = []
            for vendor in pending_vendors:
                vendors_data.append({
                    "id": vendor.id,
                    "store_name": vendor.store_name,
                    "owner_name": f"{vendor.user.first_name} {vendor.user.last_name}".strip() or vendor.user.username,
                    "email": vendor.user.email,
                    "phone": vendor.phone,
                    "address": vendor.address,
                    "joined": vendor.created_at.strftime("%Y-%m-%d"),
                    "status": vendor.status
                })
            
            return JsonResponse(vendors_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_update_vendor_status(request):
    if request.method == "POST":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            data = json.loads(request.body)
            vendor_id = data.get("vendor_id")
            action = data.get("action") # 'approve' or 'reject'
            admin_feedback = data.get("message", "") # optional message
            
            if not vendor_id or not action:
                return JsonResponse({"error": "Missing vendor_id or action"}, status=400)
            
            try:
                vendor = Vendor.objects.get(id=vendor_id)
                if action == 'approve':
                    vendor.status = 'approved'
                    if admin_feedback:
                        vendor.admin_feedback = admin_feedback
                    try:
                        email_body = 'Congratulations! Your vendor account on GearUpNepal has been approved. You can now login and start listing your products.'
                        if admin_feedback:
                            email_body += f'\n\nMessage from Admin:\n{admin_feedback}'
                        
                        send_mail(
                            'Your Vendor Account has been Approved',
                            email_body,
                            settings.EMAIL_HOST_USER,
                            [vendor.user.email],
                            fail_silently=True,
                        )
                    except Exception as e:
                        print("Failed to send approval email:", e)
                elif action == 'reject':
                    vendor.status = 'rejected'
                    if admin_feedback:
                        vendor.admin_feedback = admin_feedback
                    try:
                        email_body = 'Unfortunately, your recent vendor account registration on GearUpNepal has been rejected. Please contact the administrator for more information.'
                        if admin_feedback:
                            email_body += f'\n\nMessage from Admin:\n{admin_feedback}'

                        send_mail(
                            'Update regarding your Vendor Account',
                            email_body,
                            settings.EMAIL_HOST_USER,
                            [vendor.user.email],
                            fail_silently=True,
                        )
                    except Exception as e:
                        print("Failed to send rejection email:", e)
                elif action == 'suspend':
                    vendor.status = 'suspended'
                elif action == 'unsuspend':
                    vendor.status = 'approved'
                elif action == 'delete':
                    vendor.user.delete() # Casacades to vendor and products
                    return JsonResponse({"message": "Vendor deleted successfully"}, status=200)
                else:
                    return JsonResponse({"error": "Invalid action"}, status=400)
                
                vendor.save()
                return JsonResponse({"message": f"Vendor {action}d successfully"}, status=200)

            except Vendor.DoesNotExist:
                return JsonResponse({"error": "Vendor not found"}, status=404)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_dashboard_stats(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            # Fetch stats
            total_users = User.objects.count()
            active_vendors = Vendor.objects.filter(status='approved').count()
            pending_approvals = Vendor.objects.filter(status='pending').count()
            
            # Calculate real revenue and orders
            total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
            total_orders = Order.objects.count()

            return JsonResponse({
                "total_users": total_users,
                "active_vendors": active_vendors,
                "pending_approvals": pending_approvals,
                "total_revenue": float(total_revenue),
                "total_orders": total_orders
            }, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_top_vendors(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            # Get top 4 vendors by revenue
            top_vendors = Vendor.objects.filter(status='approved').annotate(
                total_revenue=Sum('vendor_orders__total_amount'),
                order_count=Count('vendor_orders')
            ).order_by('-total_revenue')[:4]

            vendors_data = []
            for v in top_vendors:
                vendors_data.append({
                    "name": v.store_name,
                    "revenue": float(v.total_revenue or 0),
                    "orders": v.order_count or 0,
                    "rating": 4.8  # Rating system not yet implemented
                })
            
            return JsonResponse(vendors_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_recent_activities(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            # Optional limit parameter
            limit_val = request.GET.get('limit', 5)
            try:
                limit_val = int(limit_val)
            except ValueError:
                limit_val = 5
            
            activities = []
            
            # 1. Fetch recent Products
            recent_products = Product.objects.all().select_related('vendor').order_by('-created_at')[:limit_val]
            for p in recent_products:
                activities.append({
                    "type": "vendor",
                    "action": f"{p.vendor.store_name} added a new product: {p.name}",
                    "timestamp": p.created_at,
                    "color": "bg-gray-900"
                })
                
            # 2. Fetch recent Orders
            recent_orders = Order.objects.all().order_by('-created_at')[:limit_val]
            for o in recent_orders:
                activities.append({
                    "type": "order",
                    "action": f"Order #ORD-{o.id:04d} completed",
                    "timestamp": o.created_at,
                    "color": "bg-accent"
                })
                
            # 3. Fetch recent Users
            recent_users = User.objects.filter(role='customer').order_by('-date_joined')[:limit_val]
            for u in recent_users:
                activities.append({
                    "type": "user",
                    "action": f"New customer registration: {u.first_name} {u.last_name}".strip() or f"New customer registration: {u.username}",
                    "timestamp": u.date_joined,
                    "color": "bg-gray-400"
                })
                
            # Sort combined list by timestamp descending
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            
            # Format timestamps for display
            from django.utils import timezone
            import math
            now = timezone.now()
            
            for act in activities:
                diff = now - act['timestamp']
                seconds = diff.total_seconds()
                if seconds < 60:
                    act['time'] = "Just now"
                elif seconds < 3600:
                    act['time'] = f"{math.floor(seconds / 60)}m ago"
                elif seconds < 86400:
                    act['time'] = f"{math.floor(seconds / 3600)}h ago"
                else:
                    act['time'] = f"{math.floor(seconds / 86400)}d ago"
                
                # Remove non-serializable datetime
                del act['timestamp']

            return JsonResponse(activities, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_reports_stats(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            # Period filtering logic (simplified for baseline)
            # 1. Platform Totals
            total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            total_orders = Order.objects.count()
            identity_base = User.objects.filter(role='customer').count()
            
            # 2. Monthly Revenue Velocity (Last 7 Months)
            from django.utils import timezone
            from datetime import timedelta
            from django.db.models.functions import TruncMonth
            
            monthly_data = []
            now = timezone.now()
            start_date = (now - timedelta(days=210)).replace(day=1)
            
            # Group by month
            history = Order.objects.filter(created_at__gte=start_date)\
                .annotate(month=TruncMonth('created_at'))\
                .values('month')\
                .annotate(revenue=Sum('total_amount'), count=Count('id'))\
                .order_by('month')
            
            # Fill gaps and format
            month_map = {h['month'].strftime('%b').upper(): h for h in history}
            for i in range(7):
                m_date = (now - timedelta(days=30*i))
                m_name = m_date.strftime('%b').upper()
                m_data = month_map.get(m_name, {'revenue': 0, 'count': 0})
                monthly_data.append({
                    "month": m_name,
                    "revenue": float(m_data['revenue']),
                    "orders": m_data['count']
                })
            monthly_data.reverse()
            
            # 3. Categorical Distribution (Segment Share)
            category_stats = Order.objects.values('product__category')\
                .annotate(revenue=Sum('total_amount'))\
                .order_by('-revenue')
            
            category_breakdown = []
            total_cat_rev = sum([float(c['revenue']) for c in category_stats]) if category_stats else 1
            
            for c in category_stats:
                rev = float(c['revenue'])
                cat_name = c['product__category'].capitalize() if c['product__category'] else "Other"
                category_breakdown.append({
                    "category": cat_name,
                    "revenue": rev,
                    "percentage": round((rev / total_cat_rev) * 100) if total_cat_rev > 0 else 0,
                })
            
            # Add "Other" if categories are missing or to ensure UI consistency
            if not category_breakdown:
                category_breakdown = [{"category": "Other", "revenue": 0, "percentage": 0}]

            return JsonResponse({
                "platform_yield": {"total": float(total_revenue), "growth": 14.2}, # Growth hardcoded for now or calculated later
                "total_orders": {"total": total_orders, "growth": 8.7},
                "identity_base": {"total": identity_base, "growth": 22.4},
                "monthly_revenue": monthly_data,
                "category_breakdown": category_breakdown
            }, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_users_list(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            users = User.objects.all().order_by('-date_joined')
            users_data = []
            for u in users:
                # Determine role
                role = u.role
                if u.is_superuser:
                    role = "admin"
                
                # Check suspension status
                is_suspended = u.is_suspended()
                if is_suspended:
                    status = "suspended"
                elif u.is_active:
                    status = "active"
                else:
                    status = "inactive"
                
                users_data.append({
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "first_name": u.first_name,
                    "last_name": u.last_name,
                    "name": f"{u.first_name} {u.last_name}".strip() or u.username,
                    "role": role,
                    "is_active": u.is_active,
                    "is_suspended": is_suspended,
                    "suspended_until": u.suspended_until.isoformat() if u.suspended_until else None,
                    "status": status,
                    "date_joined": u.date_joined.strftime("%Y-%m-%d"),
                })
            
            return JsonResponse(users_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_suspend_user(request):
    if request.method == "POST":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            admin_user = token.user
            if not (admin_user.is_superuser or admin_user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            data = json.loads(request.body)
            user_id = data.get("user_id")
            action = data.get("action")  # 'suspend' or 'unsuspend'
            
            if not user_id or not action:
                return JsonResponse({"error": "Missing user_id or action"}, status=400)
            
            try:
                target_user = User.objects.get(id=user_id)
                
                # Prevent suspending admin users
                if target_user.is_superuser or target_user.role == 'admin':
                    return JsonResponse({"error": "Cannot suspend admin users"}, status=400)
                
                if action == 'suspend':
                    target_user.suspended_until = timezone.now() + timedelta(hours=24)
                    target_user.save()
                    return JsonResponse({"message": "User suspended for 24 hours"}, status=200)
                elif action == 'unsuspend':
                    target_user.suspended_until = None
                    target_user.save()
                    return JsonResponse({"message": "User unsuspended successfully"}, status=200)
                else:
                    return JsonResponse({"error": "Invalid action. Use 'suspend' or 'unsuspend'"}, status=400)
                    
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)




def _get_vendor_from_token(request):
    """Helper to extract vendor from token auth. Returns (vendor, error_response)."""
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


def _get_user_from_token(request):
    """Helper to extract user from token auth. Returns (user, error_response)."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Token '):
        return None, JsonResponse({"error": "Unauthorized"}, status=401)
    
    token_key = auth_header.split(' ')[1]
    try:
        token = Token.objects.get(key=token_key)
        return token.user, None
    except Token.DoesNotExist:
        return None, JsonResponse({"error": "Invalid token"}, status=401)


@csrf_exempt
def vendor_dashboard_stats(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        total_revenue = Order.objects.filter(vendor=vendor).aggregate(
            total=Sum('total_amount'))['total'] or 0
        total_orders = Order.objects.filter(vendor=vendor).count()
        products_listed = Product.objects.filter(vendor=vendor, is_active=True).count()
        pending_orders = Order.objects.filter(vendor=vendor, status='pending').count()

        return JsonResponse({
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "products_listed": products_listed,
            "pending_orders": pending_orders,
        }, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_recent_orders(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        orders = Order.objects.filter(vendor=vendor).select_related(
            'product', 'customer')[:5]
        
        orders_data = []
        for order in orders:
            orders_data.append({
                "id": f"#ORD-{order.id:04d}",
                "customer": f"{order.customer.first_name} {order.customer.last_name}".strip() or order.customer.username,
                "product": order.product.name,
                "amount": float(order.total_amount),
                "status": order.status,
                "date": order.created_at.strftime("%Y-%m-%d"),
            })
        
        return JsonResponse(orders_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_orders_list(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        orders = Order.objects.filter(vendor=vendor).select_related(
            'product', 'customer').order_by('-created_at')
        
        orders_data = []
        for order in orders:
            orders_data.append({
                "id": f"#ORD-{order.id:04d}",
                "raw_id": order.id,
                "customer": f"{order.customer.first_name} {order.customer.last_name}".strip() or order.customer.username,
                "product": order.product.name,
                "quantity": order.quantity,
                "amount": float(order.total_amount),
                "status": order.status,
                "date": order.created_at.strftime("%Y-%m-%d"),
                "address": order.shipping_address,
            })
        
        return JsonResponse(orders_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_update_order_status(request):
    if request.method == "POST":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        data = json.loads(request.body)
        order_id = data.get("order_id")
        new_status = data.get("status")
        
        if not order_id or not new_status:
            return JsonResponse({"error": "Missing order_id or status"}, status=400)
        
        try:
            # Strip the #ORD- prefix if it exists in the incoming ID
            if isinstance(order_id, str) and order_id.startswith("#ORD-"):
                order_id = int(order_id.replace("#ORD-", ""))
            
            order = Order.objects.get(id=order_id, vendor=vendor)
            
            valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
            if new_status not in valid_statuses:
                return JsonResponse({"error": "Invalid status"}, status=400)
            
            order.status = new_status
            order.save()
            return JsonResponse({"message": "Order status updated successfully"}, status=200)
        except Order.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_recent_products(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        products = Product.objects.filter(vendor=vendor).order_by('-created_at')[:5]
        
        products_data = []
        for product in products:
            image_url = request.build_absolute_uri(product.image.url) if product.image else ""
                
            products_data.append({
                "id": product.id,
                "name": product.name,
                "category": product.get_category_display(),
                "price": float(product.price),
                "quantity": product.quantity,
                "image": image_url,
                "date": product.created_at.strftime("%Y-%m-%d"),
            })
        
        return JsonResponse(products_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_product_list(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        products = Product.objects.filter(vendor=vendor).order_by('-created_at')
        
        products_data = []
        for product in products:
            image_url = request.build_absolute_uri(product.image.url) if product.image else ""
                
            products_data.append({
                "id": product.id,
                "name": product.name,
                "category": product.get_category_display(),
                "category_slug": product.category,
                "price": float(product.price),
                "compare_price": float(product.compare_price) if product.compare_price else None,
                "quantity": product.quantity,
                "image": image_url,
                "is_active": product.is_active,
                "date": product.created_at.strftime("%Y-%m-%d %H:%M"),
            })
        
        return JsonResponse(products_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_delete_product(request, product_id):
    if request.method == "DELETE":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        try:
            product = Product.objects.get(id=product_id, vendor=vendor)
            product.delete()
            return JsonResponse({"message": "Product deleted successfully"}, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def public_product_list(request):
    if request.method == "GET":
        category = request.GET.get('category')
        
        products = Product.objects.filter(is_active=True).order_by('-created_at')
        
        if category:
            products = products.filter(category=category)
            
        products_data = []
        for product in products:
            image_url = request.build_absolute_uri(product.image.url) if product.image else ""
            image2_url = request.build_absolute_uri(product.image2.url) if product.image2 else ""
            image3_url = request.build_absolute_uri(product.image3.url) if product.image3 else ""
                
            products_data.append({
                "id": product.id,
                "name": product.name,
                "category": product.get_category_display(),
                "category_slug": product.category,
                "price": float(product.price),
                "compare_price": float(product.compare_price) if product.compare_price else None,
                "size": product.size,
                "image": image_url,
                "image2": image2_url,
                "image3": image3_url,
                "is_new": (timezone.now() - product.created_at).days < 7,
                "discount": int(((product.compare_price - product.price) / product.compare_price) * 100) if product.compare_price and product.compare_price > product.price else None,
            })
        
        return JsonResponse(products_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def public_category_stats(request):
    """Returns live product counts per category slug."""
    if request.method == "GET":
        counts = (
            Product.objects.filter(is_active=True)
            .values('category')
            .annotate(count=Count('id'))
        )
        counts_map = {item['category']: item['count'] for item in counts}
        return JsonResponse(counts_map, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def public_product_detail(request, product_id):
    if request.method == "GET":
        try:
            product = Product.objects.get(id=product_id, is_active=True)
            image_url = request.build_absolute_uri(product.image.url) if product.image else ""
            image2_url = request.build_absolute_uri(product.image2.url) if product.image2 else ""
            image3_url = request.build_absolute_uri(product.image3.url) if product.image3 else ""
            
            data = {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.get_category_display(),
                "category_slug": product.category,
                "price": float(product.price),
                "compare_price": float(product.compare_price) if product.compare_price else None,
                "image": image_url,
                "image2": image2_url,
                "image3": image3_url,
                "sku": product.sku,
                "quantity": product.quantity,
                "is_new": (timezone.now() - product.created_at).days < 7,
                "discount": int(((product.compare_price - product.price) / product.compare_price) * 100) if product.compare_price and product.compare_price > product.price else None,
                "vendor_name": product.vendor.store_name,
                "vendor_id": product.vendor.id,
                "average_rating": product.average_rating,
                "reviews": ProductReviewSerializer(product.reviews.all(), many=True).data
            }
            return JsonResponse(data, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def public_vendor_detail(request, vendor_id):
    if request.method == "GET":
        try:
            vendor = Vendor.objects.get(id=vendor_id)
            products = Product.objects.filter(vendor=vendor, is_active=True).order_by('-created_at')
            
            products_data = []
            for product in products:
                image_url = request.build_absolute_uri(product.image.url) if product.image else ""
                products_data.append({
                    "id": product.id,
                    "name": product.name,
                    "price": float(product.price),
                    "image": image_url,
                    "category": product.get_category_display(),
                })
            
            data = {
                "id": vendor.id,
                "store_name": vendor.store_name,
                "owner_name": f"{vendor.user.first_name} {vendor.user.last_name}".strip() or vendor.user.username,
                "email": vendor.user.email,
                "phone": vendor.phone,
                "address": vendor.address,
                "city": vendor.city,
                "status": vendor.status,
                "products": products_data,
                "products_count": len(products_data)
            }
            return JsonResponse(data, status=200)
        except Vendor.DoesNotExist:
            return JsonResponse({"error": "Vendor not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_sales_chart(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        today = date.today()
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        chart_data = []
        
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            daily_revenue = Order.objects.filter(
                vendor=vendor,
                created_at__date=day
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            chart_data.append({
                "day": days[day.weekday()],
                "sales": float(daily_revenue),
            })
        
        return JsonResponse(chart_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)



@csrf_exempt
def vendor_add_product(request):
    if request.method == "POST":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        try:
            if request.content_type.startswith('multipart/form-data'):
                data = request.POST.copy()
                data.update(request.FILES)
            else:
                data = json.loads(request.body)
                
            # Add vendor ID to data for serializer
            data['vendor'] = vendor.id
            
            serializer = ProductSerializer(data=data)
            if serializer.is_valid():
                # Set the vendor explicitly during save
                serializer.save(vendor=vendor)
                return JsonResponse({
                    "message": "Product added successfully",
                    "product": serializer.data
                }, status=201)
            else:
                return JsonResponse({"error": serializer.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_toggle_product_status(request, product_id):
    if request.method == "POST":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
            
        try:
            product = Product.objects.get(id=product_id, vendor=vendor)
            product.is_active = not product.is_active
            product.save()
            return JsonResponse({
                "message": f"Product {'activated' if product.is_active else 'deactivated'} successfully",
                "is_active": product.is_active
            }, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_product_detail(request, product_id):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
            
        try:
            product = Product.objects.get(id=product_id, vendor=vendor)
            serializer = ProductSerializer(product)
            # Add full media URL for the image if it exists
            data = serializer.data
            if product.image:
                data['image_preview'] = request.build_absolute_uri(product.image.url)
            if product.image2:
                data['image2_preview'] = request.build_absolute_uri(product.image2.url)
            if product.image3:
                data['image3_preview'] = request.build_absolute_uri(product.image3.url)
            return JsonResponse(data, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def vendor_update_product(request, product_id):
    if request.method == "POST" or request.method == "PUT" or request.method == "PATCH":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
            
        try:
            product = Product.objects.get(id=product_id, vendor=vendor)
            
            if request.content_type.startswith('multipart/form-data'):
                data = request.POST.copy()
                data.update(request.FILES)
            else:
                data = json.loads(request.body)
                
            serializer = ProductSerializer(product, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    "message": "Product updated successfully",
                    "product": serializer.data
                }, status=200)
            else:
                return JsonResponse({"error": serializer.errors}, status=400)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def user_profile(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Token '):
        return JsonResponse({"error": "Unauthorized"}, status=401)
    
    token_key = auth_header.split(' ')[1]
    try:
        token = Token.objects.get(key=token_key)
        user = token.user

        if request.method == "GET":
            serializer = UserProfileSerializer(user)
            return JsonResponse(serializer.data, status=200)
        
        elif request.method == "POST" or request.method == "PUT":
            # Support both JSON and multipart/form-data
            if request.content_type.startswith('multipart/form-data'):
                # For multipart, we need to merge POST data and FILES
                # Using a copy of POST to avoid modifying the original and then updating with FILES
                data = request.POST.copy()
                data.update(request.FILES)
                serializer = UserProfileSerializer(user, data=data, partial=True)
            else:
                data = json.loads(request.body)
                serializer = UserProfileSerializer(user, data=data, partial=True)
                
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    "message": "Profile updated successfully",
                    "user": serializer.data
                }, status=200)
            return JsonResponse({"error": serializer.errors}, status=400)

    except Token.DoesNotExist:
        return JsonResponse({"error": "Invalid token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# Cart and Wishlist Views

@csrf_exempt
def cart_list(request):
    if request.method == "GET":
        user, error = _get_user_from_token(request)
        if error:
            return error
        
        cart_items = CartItem.objects.filter(customer=user)
        serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False, status=200)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def cart_add(request):
    if request.method == "POST":
        user, error = _get_user_from_token(request)
        if error:
            return error
        
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            quantity = int(data.get('quantity', 1))
            
            if not product_id:
                return JsonResponse({"error": "Product ID is required"}, status=400)
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return JsonResponse({"error": "Product not found"}, status=404)

            cart_item, created = CartItem.objects.get_or_create(
                customer=user,
                product=product
            )
            
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
            
            cart_item.save()

            return JsonResponse({
                "message": "Product added to cart",
                "item": CartItemSerializer(cart_item, context={'request': request}).data
            }, status=201)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def cart_remove(request, item_id):
    if request.method == "DELETE" or request.method == "POST":
        user, error = _get_user_from_token(request)
        if error:
            return error
            
        try:
            cart_item = CartItem.objects.get(id=item_id, customer=user)
            cart_item.delete()
            return JsonResponse({"message": "Item removed from cart"}, status=200)
        except CartItem.DoesNotExist:
            return JsonResponse({"error": "Item not found in cart"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def wishlist_list(request):
    if request.method == "GET":
        user, error = _get_user_from_token(request)
        if error:
            return error
        
        wishlist_items = WishlistItem.objects.filter(customer=user)
        serializer = WishlistItemSerializer(wishlist_items, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False, status=200)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def wishlist_add(request):
    if request.method == "POST":
        user, error = _get_user_from_token(request)
        if error:
            return error
        
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            
            if not product_id:
                return JsonResponse({"error": "Product ID is required"}, status=400)
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return JsonResponse({"error": "Product not found"}, status=404)

            wishlist_item, created = WishlistItem.objects.get_or_create(
                customer=user,
                product=product
            )
            
            return JsonResponse({
                "message": "Product added to wishlist",
                "item": WishlistItemSerializer(wishlist_item, context={'request': request}).data
            }, status=201 if created else 200)
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def wishlist_remove(request, item_id):
    if request.method == "DELETE" or request.method == "POST":
        user, error = _get_user_from_token(request)
        if error:
            return error
            
        try:
            wishlist_item = WishlistItem.objects.get(id=item_id, customer=user)
            wishlist_item.delete()
            return JsonResponse({"message": "Item removed from wishlist"}, status=200)
        except WishlistItem.DoesNotExist:
            return JsonResponse({"error": "Item not found in wishlist"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_vendors_list(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            vendors = Vendor.objects.all().annotate(
                product_count=Count('products'),
                total_revenue=Sum('vendor_orders__total_amount')
            ).order_by('-created_at')

            vendors_data = []
            for v in vendors:
                vendors_data.append({
                    "id": v.id,
                    "store_name": v.store_name,
                    "owner_name": f"{v.user.first_name} {v.user.last_name}".strip() or v.user.username,
                    "email": v.user.email,
                    "phone": v.phone,
                    "address": v.address,
                    "products": v.product_count or 0,
                    "revenue": float(v.total_revenue or 0),
                    "status": v.status,
                    "joined": v.created_at.strftime("%Y-%m-%d"),
                })
            
            return JsonResponse(vendors_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def public_product_search(request):
    """Returns products matching search query."""
    if request.method == "GET":
        query = request.GET.get('q', '').strip()
        if not query:
            return JsonResponse([], safe=False)
            
        products = Product.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query),
            is_active=True
        )[:8]  # Limit to 8 results for the dropdown
        
        products_data = []
        for product in products:
            image_url = ""
            if product.image:
                image_url = request.build_absolute_uri(product.image.url)
                
            products_data.append({
                "id": product.id,
                "name": product.name,
                "price": float(product.price),
                "image": image_url,
                "category": product.get_category_display()
            })
            
        return JsonResponse(products_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def customer_orders(request):
    if request.method == "GET":
        user, error = _get_user_from_token(request)
        if error: return error
        
        orders = Order.objects.filter(customer=user).select_related('product', 'vendor')
        orders_data = []
        for order in orders:
            orders_data.append({
                "id": f"#ORD-{order.id:04d}",
                "product_name": order.product.name,
                "vendor_name": order.vendor.store_name,
                "amount": float(order.total_amount),
                "status": order.status,
                "date": order.created_at.strftime("%Y-%m-%d"),
                "image": request.build_absolute_uri(order.product.image.url) if order.product.image else ""
            })
        return JsonResponse(orders_data, safe=False, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def change_password(request):
    if request.method == "POST":
        user, error = _get_user_from_token(request)
        if error: return error
        
        try:
            data = json.loads(request.body)
            current_password = data.get("current_password")
            new_password = data.get("new_password")
            
            if not user.check_password(current_password):
                return JsonResponse({"error": "Incorrect current password"}, status=400)
                
            user.set_password(new_password)
            user.save()
            return JsonResponse({"message": "Password updated successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def delete_account(request):
    if request.method == "DELETE":
        user, error = _get_user_from_token(request)
        if error: return error
        
        try:
            user.delete()
            return JsonResponse({"message": "Account deleted successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def submit_review(request, product_id):
    if request.method == "POST":
        user, error_resp = _get_user_from_token(request)
        if error_resp:
            return error_resp
        
        try:
            product = Product.objects.get(id=product_id)
            data = json.loads(request.body)
            rating = data.get('rating')
            comment = data.get('comment', '')

            if not rating:
                return JsonResponse({"error": "Rating is required"}, status=400)

            # Check if user has a delivered order for this product
            # Note: Multiple orders might exist, at least one must be 'delivered'
            has_delivered_order = Order.objects.filter(
                customer=user,
                product=product,
                status='delivered'
            ).exists()

            if not has_delivered_order:
                return JsonResponse({"error": "Only customers who purchased this product and had it delivered can leave a review."}, status=403)

            # Create or update review
            review, created = ProductReview.objects.update_or_create(
                customer=user,
                product=product,
                defaults={'rating': rating, 'comment': comment}
            )

            return JsonResponse({
                "message": "Review submitted successfully",
                "review": {
                    "id": review.id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "created_at": review.created_at
                }
            }, status=201 if created else 200)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def check_review_eligibility(request, product_id):
    if request.method == "GET":
        user, error_resp = _get_user_from_token(request)
        if error_resp:
            return JsonResponse({"can_review": False, "reason": "login_required"}, status=200)
        
        try:
            product = Product.objects.get(id=product_id)
            
            has_delivered_order = Order.objects.filter(
                customer=user,
                product=product,
                status='delivered'
            ).exists()

            existing_review = ProductReview.objects.filter(customer=user, product=product).first()
            
            return JsonResponse({
                "can_review": has_delivered_order,
                "has_purchased": has_delivered_order,
                "existing_review": {
                    "rating": existing_review.rating,
                    "comment": existing_review.comment
                } if existing_review else None
            }, status=200)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_products_list(request):
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            products = Product.objects.all().select_related('vendor', 'vendor__user').order_by('-created_at')

            products_data = []
            for p in products:
                image_url = request.build_absolute_uri(p.image.url) if p.image else ""
                products_data.append({
                    "id": p.id,
                    "name": p.name,
                    "category": p.get_category_display(),
                    "category_slug": p.category,
                    "price": float(p.price),
                    "quantity": p.quantity,
                    "is_active": p.is_active,
                    "sku": p.sku,
                    "image": image_url,
                    "vendor": {
                        "id": p.vendor.id,
                        "storeName": p.vendor.store_name,
                        "owner": f"{p.vendor.user.first_name} {p.vendor.user.last_name}".strip() or p.vendor.user.username,
                    }
                })
            
            return JsonResponse(products_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def admin_delete_product(request, product_id):
    if request.method == "DELETE" or request.method == "POST":
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
             return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            if not (user.is_superuser or user.is_staff):
                 return JsonResponse({"error": "Forbidden: Admin access required"}, status=403)
            
            product = Product.objects.get(id=product_id)
            product.delete()
            return JsonResponse({"message": "Product removed from platform catalog"}, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
            
    return JsonResponse({"error": "Invalid request method"}, status=405)
