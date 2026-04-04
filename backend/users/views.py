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
from rest_framework.authtoken.models import Token
from .serializers import UserProfileSerializer

User = get_user_model()

def generate_otp():
    return str(random.randint(100000, 999999))

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
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

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
            return JsonResponse({"error": "Failed to send email. Check SMTP settings."}, status=500)

        return JsonResponse({"message": "Verification code sent to your email."}, status=201)
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
                    from vendors.models import Vendor
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
                if user.is_suspended():
                    remaining = user.suspended_until - timezone.now()
                    hours_left = int(remaining.total_seconds() // 3600)
                    mins_left = int((remaining.total_seconds() % 3600) // 60)
                    return JsonResponse({"error": f"Your account is suspended. Try again in {hours_left}h {mins_left}m."}, status=403)
                
                if hasattr(user, 'vendor_profile') and user.vendor_profile.status == 'suspended':
                    return JsonResponse({"error": "Your vendor account is suspended."}, status=403)
                
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
def user_profile(request):
    user, error = _get_user_from_token(request)
    if error: return error

    if request.method == "GET":
        serializer = UserProfileSerializer(user)
        return JsonResponse(serializer.data, status=200)
    elif request.method in ["POST", "PUT"]:
        if request.content_type.startswith('multipart/form-data'):
            data = request.POST.copy()
            if data.get('remove_picture') == 'true':
                user.profile_picture = None
                user.save()
            data.update(request.FILES)
            serializer = UserProfileSerializer(user, data=data, partial=True)
        else:
            data = json.loads(request.body)
            if data.get('remove_picture'):
                user.profile_picture = None
                user.save()
            serializer = UserProfileSerializer(user, data=data, partial=True)
            
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Profile updated successfully", "user": serializer.data}, status=200)
        return JsonResponse({"error": serializer.errors}, status=400)
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
def forgot_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        try:
            user = User.objects.get(email=email)
            otp = generate_otp()
            cache.set(f"password_reset_otp_{email}", otp, timeout=600)
            send_mail(
                'Password Reset OTP - GearUpNepal',
                f'Your password reset OTP is: {otp}. It will expire in 10 minutes.',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return JsonResponse({"message": "Password reset OTP sent to your email."}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User with this email does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def verify_reset_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        cached_otp = cache.get(f"password_reset_otp_{email}")
        if not cached_otp or cached_otp != otp:
            return JsonResponse({"error": "OTP has expired or is invalid."}, status=400)
        cache.set(f"password_reset_verified_{email}", True, timeout=300)
        cache.delete(f"password_reset_otp_{email}")
        return JsonResponse({"message": "OTP verified successfully. You can now reset your password."}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")
        if new_password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)
        if not cache.get(f"password_reset_verified_{email}"):
            return JsonResponse({"error": "Session expired or email not verified."}, status=403)
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            cache.delete(f"password_reset_verified_{email}")
            return JsonResponse({"message": "Password reset successfully."}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def admin_users_list(request):
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff):
        return JsonResponse({"error": "Forbidden"}, status=403)
    
    users = User.objects.all().order_by('-date_joined')
    users_data = []
    for u in users:
        role = "admin" if u.is_superuser else u.role
        is_suspended = u.is_suspended()
        status = "suspended" if is_suspended else ("active" if u.is_active else "inactive")
        users_data.append({
            "id": u.id, "username": u.username, "email": u.email,
            "name": f"{u.first_name} {u.last_name}".strip() or u.username,
            "role": role, "status": status, "date_joined": u.date_joined.strftime("%Y-%m-%d"),
        })
    return JsonResponse(users_data, safe=False, status=200)

@csrf_exempt
def admin_suspend_user(request):
    user, error = _get_user_from_token(request)
    if error: return error
    if not (user.is_superuser or user.is_staff):
        return JsonResponse({"error": "Forbidden"}, status=403)
    
    data = json.loads(request.body)
    user_id = data.get("user_id")
    action = data.get("action")
    try:
        target_user = User.objects.get(id=user_id)
        if target_user.is_superuser or target_user.role == 'admin':
            return JsonResponse({"error": "Cannot suspend admin users"}, status=400)
        if action == 'suspend':
            target_user.suspended_until = timezone.now() + timedelta(hours=24)
            target_user.save()
            return JsonResponse({"message": "User suspended for 24 hours"}, status=200)
        elif action == 'unsuspend':
            target_user.suspended_until = None
            target_user.save()
            return JsonResponse({"message": "User unsuspended"}, status=200)
        return JsonResponse({"error": "Invalid action"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
