from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_user, name='login'),
    path('vendor/signup/', views.vendor_signup, name='vendor_signup'),
    path('vendor/profile/', views.vendor_profile, name='vendor_profile'),
    path('admin/vendors/pending/', views.admin_pending_vendors, name='admin_pending_vendors'),
    path('admin/vendors/update-status/', views.admin_update_vendor_status, name='admin_update_vendor_status'),
    path('admin/dashboard/stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
    path('admin/users/', views.admin_users_list, name='admin_users_list'),
    path('admin/users/suspend/', views.admin_suspend_user, name='admin_suspend_user'),
    path('vendor/dashboard/stats/', views.vendor_dashboard_stats, name='vendor_dashboard_stats'),
    path('vendor/dashboard/recent-orders/', views.vendor_recent_orders, name='vendor_recent_orders'),
    path('vendor/dashboard/top-products/', views.vendor_top_products, name='vendor_top_products'),
    path('vendor/dashboard/sales-chart/', views.vendor_sales_chart, name='vendor_sales_chart'),
]