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
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Store Profile</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Global Brand Identity & Logistics Configuration</p>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <AlertCircleIcon size={16} />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-6 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <CheckCircle2Icon size={16} className="text-accent" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Identity */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Public Identity Matrix</h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Store Nomenclature</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Brand Objective / Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    placeholder="e.g., HIGH PERFORMANCE GEAR"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Enterprise Narrative</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Logistics Hub Address</h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Operations Street</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">City Node</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">State Sector</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                  <div className="space-y-3 lg:col-span-1 col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Postal Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Support Channels</h2>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Network Email</label>
                  <div className="relative group">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Voice Communication</label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Official Domain</label>
                  <div className="relative group">
                    <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                        placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Block */}
            <div className="bg-gray-900 rounded-xl p-8 sticky top-24">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-accent hover:bg-[#E65A00] text-white font-black rounded-lg transition-all active:scale-95 flex items-center justify-center gap-3 border-none cursor-pointer uppercase tracking-[0.2em] text-[10px]"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <SaveIcon size={16} />
                            Commit Profile
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
