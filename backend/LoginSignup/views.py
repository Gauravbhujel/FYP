from django.http import JsonResponse
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from datetime import timedelta
User = get_user_model()
from .models import Vendor

from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, ProductSerializer, UserProfileSerializer



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

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='customer' # Explicitly set default role
        )

        return JsonResponse(
            {"message": "User created successfully"},
            status=201
        )

    return JsonResponse({"error": "Invalid request method"}, status=405)

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

        try:
            user = User.objects.create_user(
                username=email, # Using email as username to ensure uniqueness easily
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role='vendor'
            )
            
            Vendor.objects.create(
                user=user,
                store_name=store_name,
                phone=phone,
                address=address,
                city=city,
                state=state,
                zip_code=zip_code
            )

            return JsonResponse(
                {"message": "Vendor account created successfully"},
                status=201
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

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
                    "status": vendor.status
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
                    "owner_name": f"{vendor.user.first_name} {vendor.user.last_name}",
                    "email": vendor.user.email,
                    "date": vendor.created_at.strftime("%Y-%m-%d"),
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
            
            if not vendor_id or not action:
                return JsonResponse({"error": "Missing vendor_id or action"}, status=400)
            
            try:
                vendor = Vendor.objects.get(id=vendor_id)
                if action == 'approve':
                    vendor.status = 'approved'
                elif action == 'reject':
                    vendor.status = 'rejected'
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
            
            # For now, revenue and orders are placeholders as models don't exist yet
            total_revenue = 0 
            total_orders = 0

            return JsonResponse({
                "total_users": total_users,
                "active_vendors": active_vendors,
                "pending_approvals": pending_approvals,
                "total_revenue": total_revenue,
                "total_orders": total_orders
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


from .models import Product, Order
from django.db.models import Sum, Count
from datetime import date


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
        return user.vendor_profile, None
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
def vendor_top_products(request):
    if request.method == "GET":
        vendor, error = _get_vendor_from_token(request)
        if error:
            return error
        
        products = Product.objects.filter(vendor=vendor, is_active=True).annotate(
            total_sales=Count('orders'),
            total_revenue=Sum('orders__total_amount')
        ).order_by('-total_sales')[:4]
        
        products_data = []
        for product in products:
            products_data.append({
                "name": product.name,
                "sales": product.total_sales,
                "revenue": float(product.total_revenue or 0),
                "image": product.image_url or "",
            })
        
        return JsonResponse(products_data, safe=False, status=200)

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
