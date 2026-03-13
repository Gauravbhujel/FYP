import React, { useState } from "react";
import {
  StoreIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
} from "lucide-react";

import { VendorLayout } from "../../components/vendor/VendorLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function StoreSettingsPage() {
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
    country: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/store-settings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Store settings saved successfully!");
      } else {
        alert("Error saving store settings");
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <VendorLayout currentPage="settings">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-800">Store Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your store information and preferences
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Information */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <StoreIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-slate-800">
                  Store Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Brief description of your store"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Store Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PhoneIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-slate-800">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>

                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>

                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>

                  <div className="relative">
                    <GlobeIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />

                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="https://yourstore.com"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Address */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <MapPinIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-slate-800">
                  Business Address
                </h2>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />

                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  />

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="outline"
                size="md"
                type="button"
                className="px-6 py-2.5 rounded-lg font-semibold border-slate-300 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 border-none"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </VendorLayout>
  );
}
