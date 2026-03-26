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
import { Link } from "react-router-dom";
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
        alert("Vendor account created! Check your email for OTP verification 🎉");
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
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
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 lg:p-12 font-sans">
      <div className="max-w-[800px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-8 md:p-14">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-block text-2xl font-black uppercase tracking-tighter mb-4">
              GearUp <span className="text-accent underline decoration-2 underline-offset-4">Nepal</span>
            </Link>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Vendor Registration</h2>
            <p className="text-gray-500 font-medium">Join Nepal's elite sports marketplace as a trusted partner</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Personal Information</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">First Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Ram"
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.firstName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Last Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Sharma"
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.lastName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Email Address</label>
                  <div className="relative group">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="business@example.com"
                      required
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Phone Number</label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Business Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Business Information</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Store Name</label>
                  <div className="relative group">
                    <StoreIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.storeName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium text-gray-500"
                  >
                    <option value="">Select type</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="individual">Individual Seller</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Business Address</label>
                <div className="relative group">
                  <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Physical location or main hub"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Account Security</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Create Password</label>
                  <div className="relative group">
                    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    >
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Confirm Password</label>
                  <div className="relative group">
                    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3.5 bg-white border rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent cursor-pointer" />
                <span className="text-xs font-bold text-gray-500 transition-colors">
                  I agree to the <span className="text-accent underline">Vendor Terms</span> and <span className="text-accent underline">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button
              className="w-full py-4 bg-accent text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all duration-300"
              type="submit"
            >
              Verify & Launch My Store
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Already representative of a store?{" "}
              <a href="/login" className="text-accent font-black uppercase tracking-widest text-[10px] ml-2">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
