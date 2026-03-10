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
]