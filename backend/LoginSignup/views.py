from django.http import JsonResponse
from django.contrib.auth import authenticate, get_user_model
User = get_user_model()
from .models import Vendor

from django.views.decorators.csrf import csrf_exempt
import json



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
                token, _ = Token.objects.get_or_create(user=user)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                
                role = user.role
                # Fallback purely for safety if data is old/inconsistent, though we are resetting DB
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
                
                users_data.append({
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "first_name": u.first_name,
                    "last_name": u.last_name,
                    "name": f"{u.first_name} {u.last_name}".strip() or u.username,
                    "role": role,
                    "is_active": u.is_active,
                    "status": "active" if u.is_active else "inactive",
                    "date_joined": u.date_joined.strftime("%Y-%m-%d"),
                })
            
            return JsonResponse(users_data, safe=False, status=200)

        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)
