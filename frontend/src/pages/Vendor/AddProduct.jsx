import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageIcon, DollarSignIcon, ImageIcon, PlusIcon, XIcon, AlertCircleIcon, ChevronLeftIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import api from "../../api";

export function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        if (formData[key]) data.append(key, formData[key]);
      });
      
      if (selectedFiles[0]) data.append("image", selectedFiles[0]);
      if (selectedFiles[1]) data.append("image2", selectedFiles[1]);
      if (selectedFiles[2]) data.append("image3", selectedFiles[2]);

      await api.post("vendor/products/add/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setSuccess("Product published successfully!");
      setTimeout(() => navigate("/vendor/products"), 2000);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.error ? JSON.stringify(err.response.data.error) : "Failed to publish product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout currentPage="products">
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-6">
            <button 
                onClick={() => navigate("/vendor/products")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-all border-none bg-transparent cursor-pointer group w-fit"
            >
                <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> Back to Catalog
            </button>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Create Listing</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Initialize new asset in the global store</p>
                </div>
            </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <AlertCircleIcon size={16} />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="p-6 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <PackageIcon size={16} className="text-accent" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Product Core Details</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Asset Identity</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g., PHANTOM ELITE V2"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Composition & Narrative</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                    placeholder="Describe technical specifications and engineering..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Global Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none cursor-pointer appearance-none"
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
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Operational Variance</label>
                        <select
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none cursor-pointer appearance-none"
                        >
                            <option value="free">Standard (Free)</option>
                            <option value="s">Small (S)</option>
                            <option value="m">Medium (M)</option>
                            <option value="l">Large (L)</option>
                            <option value="xl">Extra (XL)</option>
                        </select>
                    </div>
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Financials & Inventory</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Unit Valuation (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-accent uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Legacy Valuation</label>
                  <input
                    type="number"
                    name="compare_price"
                    value={formData.compare_price}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-300 uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-3 lg:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Available Resource Units</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-900 uppercase tracking-widest focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none"
                    placeholder="e.g. 50"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Visuals */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Media Matrix</h2>
              </div>
              
              <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="group relative aspect-square bg-gray-50 rounded border border-gray-100 hover:border-accent transition-all overflow-hidden grayscale group-hover:grayscale-0">
                    {previewUrls[i] ? (
                        <>
                            <img src={previewUrls[i]} alt={`Preview ${i+1}`} className="w-full h-full object-cover grayscale active:grayscale-0 hover:grayscale-0 transition-all" />
                            <button 
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-4 right-4 w-10 h-10 bg-gray-900/90 backdrop-blur text-white rounded flex items-center justify-center border-none cursor-pointer hover:bg-accent transition-all"
                            >
                                <XIcon size={16} />
                            </button>
                        </>
                    ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 text-center">
                            <PlusIcon size={20} className="text-gray-300 mb-3 group-hover:text-accent transition-colors" />
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-accent">{i === 0 ? "Main Perspective" : `Angle 0${i+1}`}</span>
                            <input type="file" className="sr-only" onChange={(e) => handleFileChange(e, i)} accept="image/*" />
                        </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Block */}
            <div className="bg-gray-900 rounded-xl p-8 sticky top-24">
               <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-6">Store Integration</h3>
               <div className="space-y-6">
                    <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                         <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Integrity Verified</span>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-accent hover:bg-[#E65A00] disabled:bg-gray-800 text-white font-black rounded-lg transition-all active:scale-95 border-none cursor-pointer text-[10px] uppercase tracking-[0.2em]"
                    >
                        {loading ? "Initializing..." : "Publish Offering"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/vendor/products")}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-black rounded-lg transition-all border border-white/10 cursor-pointer text-[10px] uppercase tracking-[0.2em]"
                    >
                        Cancel Cycle
                    </button>
               </div>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
