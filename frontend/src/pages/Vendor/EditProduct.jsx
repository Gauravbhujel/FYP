import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import api from "../../api";

export function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "football",
    size: "free",
    price: "",
    quantity: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`vendor/products/detail/${productId}/`);
        const product = response.data;
        
        setFormData({
          name: product.name,
          description: product.description || "",
          category: product.category,
          size: product.size || "free",
          price: product.price,
          quantity: product.quantity,
        });
        
        const previews = [
          product.image_preview || null,
          product.image2_preview || null,
          product.image3_preview || null
        ];
        setPreviewUrls(previews);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      } finally {
        setFetching(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);

      const url = URL.createObjectURL(file);
      const newPreviews = [...previewUrls];
      newPreviews[index] = url;
      setPreviewUrls(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        // Only append if there's a value (or it's a number/boolean)
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      if (selectedFiles[0]) data.append("image", selectedFiles[0]);
      if (selectedFiles[1]) data.append("image2", selectedFiles[1]);
      if (selectedFiles[2]) data.append("image3", selectedFiles[2]);

      await api.post(`vendor/products/update/${productId}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess("Product updated successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/vendor/products");
      }, 2000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(
        err.response?.data?.error 
          ? (typeof err.response.data.error === 'object' ? JSON.stringify(err.response.data.error) : err.response.data.error)
          : "Failed to update product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <VendorLayout currentPage="products">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="products">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
          <p className="text-slate-600 mt-1">
            Update your product listing details
          </p>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Product Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g., Pro Running Shoes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Detailed product description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                      required
                    >
                      <option value="running">Running</option>
                      <option value="basketball">Basketball</option>
                      <option value="football">Football</option>
                      <option value="tennis">Tennis</option>
                      <option value="swimming">Swimming</option>
                      <option value="cycling">Cycling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Size
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="free">Free Size</option>
                      <option value="s">Small</option>
                      <option value="m">Medium</option>
                      <option value="l">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Pricing & Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                      Rs.
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Media */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Media
              </h2>
              
              <div className="space-y-6">
                {/* Multi-Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Product Images (Up to 3)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="relative">
                        <div className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all ${previewUrls[i] ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-300 hover:border-emerald-400'}`}>
                          {previewUrls[i] ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={previewUrls[i]} 
                                alt={`Preview ${i+1}`} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...selectedFiles];
                                  newFiles[i] = null;
                                  setSelectedFiles(newFiles);
                                  const newPreviews = [...previewUrls];
                                  newPreviews[i] = null;
                                  setPreviewUrls(newPreviews);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg z-10"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                              <svg className="mx-auto h-8 w-8 text-slate-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-xs font-medium text-slate-600">Upload Image {i+1}</span>
                              <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, i)} accept="image/*" />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-500 text-center italic">
                    First image is primary. Leave others empty to keep existing or upload new to replace.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-3 mt-8">
              <Button 
                type="button"
                variant="outline" 
                size="md" 
                className="px-6 py-2.5 rounded-lg font-semibold border-slate-300 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                onClick={() => navigate("/vendor/products")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 border-none disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </VendorLayout>
  );
}
