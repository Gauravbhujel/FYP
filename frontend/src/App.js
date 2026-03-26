import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import DealsPage from "./pages/DealsPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import { VendorDashboard } from "./pages/Vendor/VendorDashboard";
import { AddProductPage } from "./pages/Vendor/AddProduct";
import { ManageProductsPage } from "./pages/Vendor/ManageProducts";
import { EditProductPage } from "./pages/Vendor/EditProduct";
import { ManageOrdersPage } from "./pages/Vendor/ManageOrder";
import { StoreSettingsPage } from "./pages/Vendor/StoreSettings";
import { VendorSignupPage } from "./components/VendorSignup";
import VerifyEmailPage from "./components/VerifyEmail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AdminUsersPage } from "./pages/Admin/AdminUser";
import { AdminVendorsPage } from "./pages/Admin/AdminVendors";
import { AdminProductsPage } from "./pages/Admin/AdminProduct";
import AdminReportsPage from "./pages/Admin/AdminReport";
import AdminSettingsPage from "./pages/Admin/AdminSetting";
import { AdminActivityLogsPage } from "./pages/Admin/AdminActivityLogs";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import VendorProfilePage from "./pages/VendorProfilePage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "vendor") return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "vendor") return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const CustomerOrPublicRoute = ({ children }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "vendor") return <Navigate to="/vendor/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <Routes>
          <Route path="/" element={<CustomerOrPublicRoute><HomePage /></CustomerOrPublicRoute>} />
          <Route path="/products" element={<CustomerOrPublicRoute><ProductListPage /></CustomerOrPublicRoute>} />
          <Route path="/deals" element={<CustomerOrPublicRoute><DealsPage /></CustomerOrPublicRoute>} />
          <Route path="/categories" element={<CustomerOrPublicRoute><CategoryPage /></CustomerOrPublicRoute>} />
          <Route path="/cart" element={<CustomerOrPublicRoute><CartPage /></CustomerOrPublicRoute>} />
          <Route path="/wishlist" element={<CustomerOrPublicRoute><WishlistPage /></CustomerOrPublicRoute>} />
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/signup" element={<PublicAuthRoute><Signup /></PublicAuthRoute>} />
          <Route path="/verify-email" element={<PublicAuthRoute><VerifyEmailPage /></PublicAuthRoute>} />
          <Route path="/profile" element={<CustomerOrPublicRoute><ProfilePage /></CustomerOrPublicRoute>} />
          <Route path="/product/:productId" element={<CustomerOrPublicRoute><ProductDetailsPage /></CustomerOrPublicRoute>} />
          <Route path="/vendor/:vendorId" element={<CustomerOrPublicRoute><VendorProfilePage /></CustomerOrPublicRoute>} />
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/vendor/signup" element={<PublicAuthRoute><VendorSignupPage /></PublicAuthRoute>} />
          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute allowedRole="vendor">
                <ManageProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/AddProduct"
            element={
              <ProtectedRoute allowedRole="vendor">
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/edit-product/:productId"
            element={
              <ProtectedRoute allowedRole="vendor">
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute allowedRole="vendor">
                <ManageOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/settings"
            element={
              <ProtectedRoute allowedRole="vendor">
                <StoreSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminVendorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminActivityLogsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
