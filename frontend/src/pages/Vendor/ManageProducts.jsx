import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, Edit2Icon, Trash2Icon, TagIcon, PackageIcon } from "lucide-react";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import api from "../../api";

export function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("vendor/products/");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`vendor/products/delete/${productId}/`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const response = await api.post(`vendor/products/toggle-status/${productId}/`);
      setProducts(products.map((p) => 
        p.id === productId ? { ...p, is_active: response.data.is_active } : p
      ));
    } catch (err) {
      console.error("Error toggling product status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <VendorLayout currentPage="products">
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-8 py-10 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto w-full">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                Product
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                 Global Inventory Management Control
              </p>
            </div>
            <Link to="/vendor/AddProduct">
              <button className="bg-accent text-white px-8 py-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border-none cursor-pointer hover:bg-[#EA580C] hover:scale-[1.02] active:scale-95">
                <PlusIcon size={16} />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-12 lg:px-12 w-full">
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-black uppercase tracking-widest">
              Error Profile: {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20 grayscale opacity-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-300 p-20 text-center shadow-sm">
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">No Inventory Detected</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 max-w-xs mx-auto leading-relaxed">
                Begin populating your store catalog to initialize revenue streams
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-300">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-24">Item</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Properties</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pricing</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">State</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors group">
                      <td className="px-8 py-6">
                        <div className="h-12 w-12 rounded border border-gray-300 overflow-hidden grayscale transition-all">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-300">N/A</div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{product.name}</span>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Rs. {product.price.toLocaleString()}</span>
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                            product.quantity === 0 ? "text-rose-600 animate-pulse" : 
                            product.quantity < 5 ? "text-amber-500" : 
                            "text-gray-400"
                          }`}>
                            Stock: {product.quantity} {product.quantity === 0 ? "(Sold Out)" : product.quantity < 5 ? "(Low Stock)" : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => handleToggleStatus(product.id)}
                          className={`px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.05] active:scale-95 ${
                            product.is_active 
                            ? "bg-green-50 text-green-600 hover:bg-green-100" 
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {product.is_active ? "Operational" : "Offline"}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                            className="p-2 text-gray-400 rounded transition-colors"
                          >
                            <Edit2Icon size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 rounded transition-colors"
                          >
                            <Trash2Icon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
