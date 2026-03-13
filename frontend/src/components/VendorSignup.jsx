import React, { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  StoreIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function VendorSignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.storeName) newErrors.storeName = "Store name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/vendor/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Vendor account created successfully 🎉");
        window.location.href = "/login";
      } else {
        setErrors({ form: data.error || "Signup failed" });
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      alert("Failed to connect to backend. Is Django running?");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center transform -rotate-12">
              <span className="text-white font-bold text-2xl transform rotate-12">
                G
              </span>
            </div>
            <span className="text-3xl font-bold text-slate-800">
              GearUp Nepal
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Become a Vendor</h2>
          <p className="text-slate-600 mt-2">
            Start selling sports equipment to athletes worldwide
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder=""
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.firstName ? "border-red-500" : "border-slate-200"
                        }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder=""
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.lastName ? "border-red-500" : "border-slate-200"
                      }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.email ? "border-red-500" : "border-slate-200"
                        }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9800000000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Info & Address */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Business Information
              </h3>
              <div className="space-y-4">
                {/* Store Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Store Name
                  </label>
                  <div className="relative">
                    <StoreIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Your Sports Store"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.storeName ? "border-red-500" : "border-slate-200"
                        }`}
                    />
                  </div>
                  {errors.storeName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.storeName}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="">Select business type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="individual">Individual Seller</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Address
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Account Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.password ? "border-red-500" : "border-slate-200"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:border-secondary transition-colors ${errors.confirmPassword
                          ? "border-red-500"
                          : "border-slate-200"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-primary rounded focus:ring-secondary"
                required
              />
              <label className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <a
                  href="/vendor-terms"
                  className="text-primary hover:text-secondary font-medium"
                >
                  Vendor Terms
                </a>
                ,{" "}
                <a
                  href="/terms-of-service"
                  className="text-primary hover:text-secondary font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-primary hover:text-secondary font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full !bg-secondary !hover:bg-[#157347]"
            >
              Create Vendor Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:text-secondary font-semibold"
            >
              Sign in
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}
