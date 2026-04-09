from django.urls import path, include
from users import views as user_views
from vendors import views as vendor_views
from products import views as product_views
from orders import views as order_views
from payments import views as payment_views

urlpatterns = [
    # Auth / Users
    path('signup/', user_views.signup, name='signup'),
    path('verify-email/', user_views.verify_email, name='verify_email'),
    path('login/', user_views.login_user, name='login'),
    path('user/profile/', user_views.user_profile, name='user_profile'),
    path('user/orders/', order_views.customer_orders, name='customer_orders'),
    path('user/orders/cancel/<str:order_id>/', order_views.cancel_order, name='cancel_order'),
    path('user/change-password/', user_views.change_password, name='change_password'),
    path('user/delete-account/', user_views.delete_account, name='delete_account'),
    path('forgot-password/', user_views.forgot_password, name='forgot_password'),
    path('verify-reset-otp/', user_views.verify_reset_otp, name='verify_reset_otp'),
    path('reset-password/', user_views.reset_password, name='reset_password'),
    
    # Vendors
    path('vendor/signup/', vendor_views.vendor_signup, name='vendor_signup'),
    path('vendor/profile/', vendor_views.vendor_profile, name='vendor_profile'),
    path('vendor/dashboard/stats/', vendor_views.vendor_dashboard_stats, name='vendor_dashboard_stats'),
    path('vendor/dashboard/recent-orders/', vendor_views.vendor_recent_orders, name='vendor_recent_orders'),
    path('vendor/dashboard/recent-products/', product_views.vendor_recent_products, name='vendor_recent_products'),
    path('vendor/dashboard/sales-chart/', vendor_views.vendor_sales_chart, name='vendor_sales_chart'),
    path('vendor/orders/', vendor_views.vendor_orders_list, name='vendor_orders_list'),
    path('vendor/orders/update-status/', vendor_views.vendor_update_order_status, name='vendor_update_order_status'),
    path('vendor/products/', product_views.vendor_product_list, name='vendor_product_list'),
    path('vendor/products/delete/<int:product_id>/', product_views.vendor_delete_product, name='vendor_delete_product'),
    path('vendor/products/toggle-status/<int:product_id>/', product_views.vendor_toggle_product_status, name='vendor_toggle_product_status'),
    path('vendor/products/detail/<int:product_id>/', product_views.vendor_product_detail, name='vendor_product_detail'),
    path('vendor/products/update/<int:product_id>/', product_views.vendor_update_product, name='vendor_update_product'),
    path('vendor/products/add/', product_views.vendor_add_product, name='vendor_add_product'),
    path('vendors/<int:vendor_id>/', vendor_views.public_vendor_detail, name='public_vendor_detail'),
    path('vendors/<int:vendor_id>/review/submit/<int:order_id>/', vendor_views.submit_vendor_review, name='submit_vendor_review'),
    path('vendors/<int:vendor_id>/review/check-eligibility/<int:order_id>/', vendor_views.check_vendor_review_eligibility, name='check_vendor_review_eligibility'),
    
    # Vendor Reports
    path('vendor/reports/sales/', vendor_views.vendor_report_sales, name='vendor_report_sales'),
    path('vendor/reports/orders/', vendor_views.vendor_report_orders, name='vendor_report_orders'),
    path('vendor/reports/products/', vendor_views.vendor_report_products, name='vendor_report_products'),
    
    # Products
    path('categories/stats/', product_views.public_category_stats, name='public_category_stats'),
    path('products/all/', product_views.public_product_list, name='public_product_list'),
    path('products/search/', product_views.public_product_search, name='public_product_search'),
    path('products/<int:product_id>/', product_views.public_product_detail, name='public_product_detail'),
    path('products/<int:product_id>/review/submit/', product_views.submit_review, name='submit_review'),
    path('products/<int:product_id>/review/check-eligibility/', product_views.check_review_eligibility, name='check_review_eligibility'),
    path('products/<int:product_id>/similar/', product_views.similar_products, name='similar_products'),
    path('recommendations/', product_views.recommended_products, name='recommended_products'),
    
    # Cart and Wishlist
    path('cart/', product_views.cart_list, name='cart_list'),
    path('cart/add/', product_views.cart_add, name='cart_add'),
    path('cart/remove/<int:item_id>/', product_views.cart_remove, name='cart_remove'),
    path('cart/update/<int:item_id>/', product_views.cart_update, name='cart_update'),
    path('wishlist/', product_views.wishlist_list, name='wishlist_list'),
    path('wishlist/add/', product_views.wishlist_add, name='wishlist_add'),
    path('wishlist/remove/<int:item_id>/', product_views.wishlist_remove, name='wishlist_remove'),
    
    # Admin
    path('admin/vendors/pending/', vendor_views.admin_pending_vendors, name='admin_pending_vendors'),
    path('admin/vendors/update-status/', vendor_views.admin_update_vendor_status, name='admin_update_vendor_status'),
    path('admin/vendors/list/', vendor_views.admin_vendors_list, name='admin_vendors_list'),
    path('admin/dashboard/stats/', vendor_views.admin_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/dashboard/top-vendors/', vendor_views.admin_top_vendors, name='admin_top_vendors'),
    path('admin/dashboard/activities/', vendor_views.admin_recent_activities, name='admin_recent_activities'),
    path('admin/dashboard/reports/', vendor_views.admin_reports_stats, name='admin_reports_stats'),
    path('admin/users/', user_views.admin_users_list, name='admin_users_list'),
    path('admin/users/suspend/', user_views.admin_suspend_user, name='admin_suspend_user'),
    path('admin/orders/list/', order_views.admin_orders_list, name='admin_orders_list'),
    path('admin/products/list/', product_views.admin_products_list, name='admin_products_list'),
    path('admin/products/delete/<int:product_id>/', product_views.admin_delete_product, name='admin_delete_product'),
    
    # Admin Reports
    path('admin/reports/sales/', vendor_views.admin_report_sales, name='admin_report_sales'),
    path('admin/reports/orders/', vendor_views.admin_report_orders, name='admin_report_orders'),
    path('admin/reports/products/', vendor_views.admin_report_products, name='admin_report_products'),
    path('admin/reports/customers/', vendor_views.admin_report_customers, name='admin_report_customers'),
    
    # Payments
    path('checkout/initiate/', payment_views.initiate_payment, name='initiate_payment'),
    path('payment/success/', payment_views.payment_success, name='payment_success'),
    path('payment/failure/', payment_views.payment_failure, name='payment_failure'),

    # Chat
    path('chat/', include('chat.urls')),
]
