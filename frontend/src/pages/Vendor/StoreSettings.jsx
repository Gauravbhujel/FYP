import React, { useState, useEffect } from "react";
import {
  StoreIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  SaveIcon,
  Loader2Icon,
  GlobeIcon
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

export function StoreSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    storeName: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("vendor/profile/");
        const data = response.data;
        setFormData({
          storeName: data.store_name || "",
          tagline: data.tagline || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone_number || "",
          website: data.website || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.pincode || "",
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
          store_name: formData.storeName,
          tagline: formData.tagline,
          description: formData.description,
          phone_number: formData.phone,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode
      };

      await api.post("vendor/profile/update/", payload);
      setSuccess("Your store configuration has been successfully updated.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to synchronize settings with the server.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <VendorLayout currentPage="settings">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-sm text-gray-500 font-medium">Retrieving store profile...</p>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="settings">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
        {/* Modern Header */}
        <div className="pb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Settings</h1>
            <p className="text-sm text-gray-500 font-medium">Edit your store details, address, and contact info</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center gap-3 animate-shake">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3 animate-slide-up">
            <CheckCircle2Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Brand Section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <StoreIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-base font-bold text-gray-900">Store Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    placeholder="Short mission statement..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">About Store</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none resize-none"
                    placeholder="Tell customers about your business..."
                  />
                </div>
              </div>
            </div>

            {/* Logistics Base */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <MapPinIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-base font-bold text-gray-900">Store Address</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Warehouse Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Province</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Postal Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Support Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <PhoneIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-base font-bold text-gray-900">Communication</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Public Email</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Business Phone</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-tight ml-1">Website URL</label>
                  <div className="relative">
                    <GlobeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        placeholder="https://yourstore.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Card */}
            <div className="bg-gray-50 p-2 rounded-2xl border border-gray-200 sticky top-24">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-accent text-white font-bold rounded-xl transition-all shadow-md shadow-accent/10 flex items-center justify-center gap-2 border-none cursor-pointer text-sm hover:scale-[1.02] active:scale-95 hover:bg-[#EA580C] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <SaveIcon className="w-4 h-4" />
                            Update Configuration
                        </>
                    )}
                </button>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
