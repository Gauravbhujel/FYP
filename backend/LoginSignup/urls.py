from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_user, name='login'),
    path('vendor/signup/', views.vendor_signup, name='vendor_signup'),
    path('vendor/profile/', views.vendor_profile, name='vendor_profile'),
    path('admin/vendors/pending/', views.admin_pending_vendors, name='admin_pending_vendors'),
    path('admin/vendors/update-status/', views.admin_update_vendor_status, name='admin_update_vendor_status'),
    path('admin/vendors/list/', views.admin_vendors_list, name='admin_vendors_list'),
    path('admin/dashboard/stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/dashboard/top-vendors/', views.admin_top_vendors, name='admin_top_vendors'),
    path('admin/users/', views.admin_users_list, name='admin_users_list'),
    path('admin/users/suspend/', views.admin_suspend_user, name='admin_suspend_user'),
    path('vendor/dashboard/stats/', views.vendor_dashboard_stats, name='vendor_dashboard_stats'),
    path('vendor/dashboard/recent-orders/', views.vendor_recent_orders, name='vendor_recent_orders'),
    path('vendor/dashboard/recent-products/', views.vendor_recent_products, name='vendor_recent_products'),
    path('vendor/dashboard/sales-chart/', views.vendor_sales_chart, name='vendor_sales_chart'),
    path('vendor/products/', views.vendor_product_list, name='vendor_product_list'),
    path('vendor/products/delete/<int:product_id>/', views.vendor_delete_product, name='vendor_delete_product'),
    path('vendor/products/toggle-status/<int:product_id>/', views.vendor_toggle_product_status, name='vendor_toggle_product_status'),
    path('vendor/products/detail/<int:product_id>/', views.vendor_product_detail, name='vendor_product_detail'),
    path('vendor/products/update/<int:product_id>/', views.vendor_update_product, name='vendor_update_product'),
    path('vendor/products/add/', views.vendor_add_product, name='vendor_add_product'),
    path('categories/stats/', views.public_category_stats, name='public_category_stats'),
    path('products/all/', views.public_product_list, name='public_product_list'),
    path('products/search/', views.public_product_search, name='public_product_search'),
    path('products/<int:product_id>/', views.public_product_detail, name='public_product_detail'),
    path('vendors/<int:vendor_id>/', views.public_vendor_detail, name='public_vendor_detail'),
    path('user/profile/', views.user_profile, name='user_profile'),
    
    # Cart and Wishlist
    path('cart/', views.cart_list, name='cart_list'),
    path('cart/add/', views.cart_add, name='cart_add'),
    path('cart/remove/<int:item_id>/', views.cart_remove, name='cart_remove'),
    path('wishlist/', views.wishlist_list, name='wishlist_list'),
    path('wishlist/add/', views.wishlist_add, name='wishlist_add'),
    path('wishlist/remove/<int:item_id>/', views.wishlist_remove, name='wishlist_remove'),
    path('user/orders/', views.customer_orders, name='customer_orders'),
    path('user/change-password/', views.change_password, name='change_password'),
    path('user/delete-account/', views.delete_account, name='delete_account'),
    path('products/<int:product_id>/review/submit/', views.submit_review, name='submit_review'),
    path('products/<int:product_id>/review/check-eligibility/', views.check_review_eligibility, name='check_review_eligibility'),
    
    # Admin Product Management
    path('admin/products/list/', views.admin_products_list, name='admin_products_list'),
    path('admin/products/delete/<int:product_id>/', views.admin_delete_product, name='admin_delete_product'),
]