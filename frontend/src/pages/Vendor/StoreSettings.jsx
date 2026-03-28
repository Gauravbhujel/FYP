import React, { useState, useEffect } from "react";
import {
  StoreIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  SaveIcon,
  Building2Icon
} from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

export function StoreSettingsPage() {
  const [loading, setLoading] = useState(false);
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
      // Map frontend fields to backend expected fields if necessary
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
      setSuccess("Store profile updated successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to sync store settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout currentPage="settings">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Store Configuration</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Manage your brand identity and contact details</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-accent/5 border border-accent/10 text-accent rounded-2xl flex items-center gap-3">
            <CheckCircle2Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Identity */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <StoreIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Public Identity</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Store Display Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Slogan or Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g., Best Gear for Every Athlete"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Business Autobiography</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none resize-none placeholder:text-gray-300"
                    placeholder="Describe your store history..."
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <MapPinIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Business Address</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Province/State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                        required
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-1 col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ZIP / Postal</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-sm font-black text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                        required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Contact */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <PhoneIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Support</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Public Email</label>
                  <div className="relative">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Line</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                        required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Block */}
            <div className="dashboard-card p-2 bg-accent/5 sticky top-24">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-accent text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 border-none cursor-pointer uppercase tracking-[2px] text-xs hover:scale-[1.02] active:scale-95 hover:bg-[#EA580C]"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <SaveIcon className="w-4 h-4" />
                            Edit Profile
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
