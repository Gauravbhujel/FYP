import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AdminUsersPage } from "./pages/Admin/AdminUser";
import { AdminVendorsPage } from "./pages/Admin/AdminVendors";
import { AdminProductsPage } from "./pages/Admin/AdminProduct";
import AdminReportsPage from "./pages/Admin/AdminReport";
import AdminSettingsPage from "./pages/Admin/AdminSetting";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import VendorProfilePage from "./pages/VendorProfilePage";
import { CartProvider } from "./context/CartContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRole }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/vendor/:vendorId" element={<VendorProfilePage />} />
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/vendor/signup" element={<VendorSignupPage />} />
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
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
