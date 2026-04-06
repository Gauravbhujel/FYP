from django.http import JsonResponse
from django.db.models import Count, Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from rest_framework.authtoken.models import Token
from .models import Product, ProductReview, CartItem, WishlistItem
from .serializers import (
    ProductSerializer, ProductReviewSerializer, 
    CartItemSerializer, WishlistItemSerializer
)
from vendors.models import Vendor
from orders.models import Order

@csrf_exempt
def public_product_list(request):
    if request.method == "GET":
        category = request.GET.get('category')
        products = Product.objects.filter(is_active=True).order_by('-created_at')
        if category: products = products.filter(category=category)
        data = ProductSerializer(products, many=True, context={'request': request}).data
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def public_category_stats(request):
    if request.method == "GET":
        counts = Product.objects.filter(is_active=True).values('category').annotate(count=Count('id'))
        return JsonResponse({item['category']: item['count'] for item in counts}, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def public_product_detail(request, product_id):
    if request.method == "GET":
        try:
            p = Product.objects.get(id=product_id, is_active=True)
            return JsonResponse({
                "id": p.id, "name": p.name, "description": p.description, "category": p.get_category_display(), "category_slug": p.category,
                "price": float(p.price), "compare_price": float(p.compare_price) if p.compare_price else None,
                "image": request.build_absolute_uri(p.image.url) if p.image else "",
                "image2": request.build_absolute_uri(p.image2.url) if p.image2 else "",
                "image3": request.build_absolute_uri(p.image3.url) if p.image3 else "",
                "sku": p.sku, "quantity": p.quantity, "is_new": (timezone.now() - p.created_at).days < 7,
                "discount": int(((p.compare_price - p.price) / p.compare_price) * 100) if p.compare_price and p.compare_price > p.price else None,
                "vendor_name": p.vendor.store_name, "vendor_id": p.vendor.id, 
                "vendor_rating": p.vendor.average_rating, "vendor_review_count": p.vendor.review_count,
                "average_rating": p.average_rating,
                "reviews": ProductReviewSerializer(p.reviews.all(), many=True).data
            }, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def public_product_search(request):
    if request.method == "GET":
        query = request.GET.get('q', '').strip()
        if not query: return JsonResponse([], safe=False)
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query), is_active=True)[:8]
        data = ProductSerializer(products, many=True, context={'request': request}).data
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_add_product(request):
    if request.method == "POST":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        data = request.POST.copy() if request.content_type.startswith('multipart/form-data') else json.loads(request.body)
        if request.FILES:
            data.update(request.FILES)
        data['vendor'] = vendor.id
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save(vendor=vendor)
            return JsonResponse({"message": "Added", "product": serializer.data}, status=201)
        return JsonResponse({"error": serializer.errors}, status=400)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_update_product(request, product_id):
    if request.method in ["POST", "PUT", "PATCH"]:
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        try:
            p = Product.objects.get(id=product_id, vendor=vendor)
            data = request.POST.copy() if request.content_type.startswith('multipart/form-data') else json.loads(request.body)
            if request.FILES:
                data.update(request.FILES)
            serializer = ProductSerializer(p, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"message": "Updated", "product": serializer.data}, status=200)
            return JsonResponse({"error": serializer.errors}, status=400)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_product_list(request):
    if request.method == "GET":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        products = Product.objects.filter(vendor=vendor).order_by('-created_at')
        data = ProductSerializer(products, many=True, context={'request': request}).data
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_delete_product(request, product_id):
    if request.method == "DELETE":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        try:
            p = Product.objects.get(id=product_id, vendor=vendor)
            p.delete()
            return JsonResponse({"message": "Deleted"}, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_toggle_product_status(request, product_id):
    if request.method == "POST":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        try:
            p = Product.objects.get(id=product_id, vendor=vendor)
            p.is_active = not p.is_active
            p.save()
            return JsonResponse({"message": "Toggled", "is_active": p.is_active}, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_product_detail(request, product_id):
    if request.method == "GET":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        try:
            p = Product.objects.get(id=product_id, vendor=vendor)
            data = ProductSerializer(p).data
            if p.image: data['image_preview'] = request.build_absolute_uri(p.image.url)
            if p.image2: data['image2_preview'] = request.build_absolute_uri(p.image2.url)
            if p.image3: data['image3_preview'] = request.build_absolute_uri(p.image3.url)
            return JsonResponse(data, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def vendor_recent_products(request):
    if request.method == "GET":
        from vendors.views import _get_vendor_from_token
        vendor, error = _get_vendor_from_token(request)
        if error: return error
        products = Product.objects.filter(vendor=vendor).order_by('-created_at')[:5]
        data = [{
            "id": p.id, "name": p.name, "category": p.get_category_display(),
            "price": float(p.price), "quantity": p.quantity, "image": request.build_absolute_uri(p.image.url) if p.image else "",
            "date": p.created_at.strftime("%Y-%m-%d"),
            "average_rating": p.average_rating,
            "review_count": p.reviews.count(),
        } for p in products]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

# Cart and Wishlist
@csrf_exempt
def cart_list(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        items = CartItem.objects.filter(customer=user)
        return JsonResponse(CartItemSerializer(items, many=True, context={'request': request}).data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def cart_add(request):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        data = json.loads(request.body)
        try:
            product = Product.objects.get(id=data.get('product_id'))
            item, created = CartItem.objects.get_or_create(customer=user, product=product)
            item.quantity = (item.quantity + int(data.get('quantity', 1))) if not created else int(data.get('quantity', 1))
            item.save()
            return JsonResponse({"message": "Added", "item": CartItemSerializer(item, context={'request': request}).data}, status=201)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def cart_remove(request, item_id):
    if request.method in ["DELETE", "POST"]:
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            CartItem.objects.get(id=item_id, customer=user).delete()
            return JsonResponse({"message": "Removed"}, status=200)
        except CartItem.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def cart_update(request, item_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            item = CartItem.objects.get(id=item_id, customer=user)
            qty = int(json.loads(request.body).get('quantity', 1))
            if qty <= 0: item.delete(); return JsonResponse({"message": "Removed"}, status=200)
            if qty > item.product.quantity: return JsonResponse({"error": "Stock limited"}, status=400)
            item.quantity = qty; item.save(); return JsonResponse({"message": "Updated", "quantity": qty}, status=200)
        except CartItem.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def wishlist_list(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        items = WishlistItem.objects.filter(customer=user)
        return JsonResponse(WishlistItemSerializer(items, many=True, context={'request': request}).data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def wishlist_add(request):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            product = Product.objects.get(id=json.loads(request.body).get('product_id'))
            item, created = WishlistItem.objects.get_or_create(customer=user, product=product)
            return JsonResponse({"message": "Added", "item": WishlistItemSerializer(item, context={'request': request}).data}, status=201 if created else 200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def wishlist_remove(request, item_id):
    if request.method in ["DELETE", "POST"]:
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            WishlistItem.objects.get(id=item_id, customer=user).delete()
            return JsonResponse({"message": "Removed"}, status=200)
        except WishlistItem.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def submit_review(request, product_id):
    if request.method == "POST":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        try:
            p = Product.objects.get(id=product_id)
            data = json.loads(request.body)
            if not Order.objects.filter(customer=user, product=p, status='delivered').exists():
                return JsonResponse({"error": "Only delivered purchasers can review"}, status=403)
            review, created = ProductReview.objects.update_or_create(customer=user, product=p, defaults={'rating': data.get('rating'), 'comment': data.get('comment', '')})
            return JsonResponse({"message": "Submitted", "review": {"id": review.id, "rating": review.rating}}, status=201 if created else 200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def check_review_eligibility(request, product_id):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return JsonResponse({"can_review": False, "reason": "login_required"}, status=200)
        try:
            p = Product.objects.get(id=product_id)
            has_delivered = Order.objects.filter(customer=user, product=p, status='delivered').exists()
            existing = ProductReview.objects.filter(customer=user, product=p).first()
            return JsonResponse({
                "can_review": has_delivered, "has_purchased": Order.objects.filter(customer=user, product=p).exists(),
                "existing_review": {"rating": existing.rating, "comment": existing.comment} if existing else None
            }, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_products_list(request):
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        products = Product.objects.all().select_related('vendor', 'vendor__user').order_by('-created_at')
        data = [{
            "id": p.id, "name": p.name, "category": p.get_category_display(), "category_slug": p.category,
            "price": float(p.price), "quantity": p.quantity, "is_active": p.is_active, "sku": p.sku,
            "image": request.build_absolute_uri(p.image.url) if p.image else "",
            "vendor": {"id": p.vendor.id, "storeName": p.vendor.store_name, "owner": f"{p.vendor.user.first_name} {p.vendor.user.last_name}".strip()}
        } for p in products]
        return JsonResponse(data, safe=False, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def admin_delete_product(request, product_id):
    if request.method in ["DELETE", "POST"]:
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        if error: return error
        if not (user.is_superuser or user.is_staff): return JsonResponse({"error": "Forbidden"}, status=403)
        try:
            Product.objects.get(id=product_id).delete()
            return JsonResponse({"message": "Deleted"}, status=200)
        except Product.DoesNotExist: return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
def similar_products(request, product_id):
    """
    Returns products in the same category as the current product.
    """
    if request.method == "GET":
        try:
            product = Product.objects.get(id=product_id, is_active=True)
            similar = Product.objects.filter(
                category=product.category, 
                is_active=True
            ).exclude(id=product_id).order_by('-created_at')[:8]
            
            data = ProductSerializer(similar, many=True, context={'request': request}).data
            return JsonResponse(data, safe=False, status=200)
        except Product.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
def recommended_products(request):
    """
    Returns personalized recommendations based on the user's purchase history.
    """
    if request.method == "GET":
        from users.views import _get_user_from_token
        user, error = _get_user_from_token(request)
        
        # Fallback for unauthenticated users or those with no history
        if error:
            return JsonResponse({"recommended_products": []}, status=200)

        # 1. Get all orders for the user
        user_orders = Order.objects.filter(customer=user)
        
        if not user_orders.exists():
            # Optionally return trending products if no history
            return JsonResponse({"recommended_products": []}, status=200)

        # 2. Extract purchased product categories and IDs
        purchased_product_ids = user_orders.values_list('product_id', flat=True)
        
        # 3. Find most frequently purchased categories
        category_counts = user_orders.values('product__category').annotate(
            count=Count('product__category')
        ).order_by('-count')
        
        top_categories = [item['product__category'] for item in category_counts[:3]]
        
        # 4. Recommend products from those categories, excluding already purchased ones
        recommendations = Product.objects.filter(
            category__in=top_categories,
            is_active=True
        ).exclude(id__in=purchased_product_ids).order_by('?')[:8]
        
        data = ProductSerializer(recommendations, many=True, context={'request': request}).data
        return JsonResponse({"recommended_products": data}, status=200)

    return JsonResponse({"error": "Invalid method"}, status=405)
