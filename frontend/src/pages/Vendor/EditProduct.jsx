import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PackageIcon, DollarSignIcon, ImageIcon, CheckIcon, XIcon, AlertCircleIcon, ChevronLeftIcon, Trash2Icon, PlusIcon, ChevronDownIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
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
    compare_price: "",
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
          compare_price: product.compare_price || "",
          quantity: product.quantity,
        });
        
        setPreviewUrls([
          product.image_preview || null,
          product.image2_preview || null,
          product.image3_preview || null
        ]);
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
    setFormData({ ...formData, [name]: value });
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

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previewUrls];
    newPreviews[index] = null;
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      if (selectedFiles[0]) data.append("image", selectedFiles[0]);
      if (selectedFiles[1]) data.append("image2", selectedFiles[1]);
      if (selectedFiles[2]) data.append("image3", selectedFiles[2]);

      await api.post(`vendor/products/update/${productId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setSuccess("Product optimized and updated!");
      setTimeout(() => navigate("/vendor/products"), 2000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to sync changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <VendorLayout currentPage="products">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout currentPage="products">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-4">
            <button 
                onClick={() => navigate("/vendor/products")}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border-none bg-transparent cursor-pointer group hover:text-slate-600 hover:scale-[1.02] active:scale-95"
            >
                <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Return to Products
            </button>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Product</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Modify listing: {formData.name}</p>
                </div>
            </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3">
            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-accent/5 border border-accent/10 text-accent rounded-2xl flex items-center gap-3">
            <CheckIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent">
                    <PackageIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Product Details</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300 uppercase tracking-widest placeholder:normal-case"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-4 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none resize-none placeholder:text-gray-300 uppercase tracking-widest placeholder:normal-case"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none cursor-pointer appearance-none uppercase tracking-widest"
                                required
                            >
                                <option value="running">Running</option>
                                <option value="basketball">Basketball</option>
                                <option value="football">Football</option>
                                <option value="tennis">Tennis</option>
                                <option value="swimming">Swimming</option>
                                <option value="cycling">Cycling</option>
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Variant</label>
                        <div className="relative">
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none cursor-pointer appearance-none uppercase tracking-widest"
                            >
                                <option value="free">Free Size</option>
                                <option value="s">Small (S)</option>
                                <option value="m">Medium (M)</option>
                                <option value="l">Large (L)</option>
                                <option value="xl">Extra Large (XL)</option>
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <DollarSignIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Financials</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 text-rose-400">Compare at (Rs.)</label>
                  <input
                    type="number"
                    name="compare_price"
                    value={formData.compare_price}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-400 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300 uppercase tracking-widest placeholder:normal-case"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock Level</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm font-black text-gray-700 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300 uppercase tracking-widest placeholder:normal-case"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Visuals */}
            <div className="dashboard-card p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <ImageIcon className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-black text-slate-800 tracking-tight">Gallery</h2>
              </div>
              
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="group relative aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 transition-all overflow-hidden">
                    {previewUrls[i] ? (
                        <>
                            <img src={previewUrls[i]} alt={`Preview ${i+1}`} className="w-full h-full object-cover transition-transform" />
                            <button 
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-rose-500 shadow-lg border-none cursor-pointer transition-all"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                            <PlusIcon className="w-6 h-6 text-gray-300 mb-2 transition-colors" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{i === 0 ? "Primary" : `View ${i+1}`}</span>
                            <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, i)} accept="image/*" />
                        </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save Block */}
            <div className="dashboard-card p-8 sticky top-24 space-y-4">
                 <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-accent text-white font-black rounded-2xl transition-all shadow-xl shadow-accent/20 border-none cursor-pointer text-sm uppercase tracking-widest hover:bg-[#EA580C] hover:scale-[1.02] active:scale-95"
                >
                    {loading ? "Syncing..." : "Update Listing"}
                </button>
                <button 
                    type="button"
                    onClick={() => navigate("/vendor/products")}
                    className="w-full h-12 bg-white border border-slate-200 text-slate-400 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest cursor-pointer hover:bg-slate-50 hover:text-slate-600 hover:scale-[1.02] active:scale-95"
                >
                    Discard Changes
                </button>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
