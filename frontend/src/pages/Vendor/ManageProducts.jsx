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
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-emerald-100 px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                My Products
              </h1>
              <p className="text-slate-500 mt-1.5 font-medium">
                Manage and monitor your store inventory
              </p>
            </div>
            <Link to="/vendor/AddProduct">
              <Button className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 border-none">
                <PlusIcon className="w-5 h-5 stroke-[3px]" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center shadow-sm">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <PlusIcon className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No products yet</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Start adding products to your store to begin selling on GearUpNepal.
              </p>
              <Link to="/vendor/AddProduct">
                <Button className="bg-primary hover:bg-secondary text-white px-8 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 border-none" size="lg">
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl rounded-3xl bg-white flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 block border-b border-slate-200">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <PackageIcon className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleStatus(product.id); }}
                      className="absolute top-4 right-4 hover:scale-105 transition-transform focus:outline-none z-10"
                      title="Click to toggle status"
                    >
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm cursor-pointer ${
                        product.is_active 
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </button>

                    {/* Quick Tags Label from Image */}
                    <div className="absolute bottom-4 left-4">
                       <span className="bg-white/90 backdrop-blur-sm text-slate-600 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                         New
                       </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-3">
                      <TagIcon className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                      <Link to={`/product/${product.id}`} className="no-underline text-inherit hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    
                    <div className="flex items-baseline gap-1 mt-auto mb-6">
                      <span className="text-slate-500 text-sm font-bold">Rs.</span>
                      <span className="text-2xl font-black text-slate-900 leading-none">
                        {product.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="ghost"
                        className="bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-100 transition-all active:scale-95"
                        onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                      >
                        <Edit2Icon className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-100 transition-all active:scale-95"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2Icon className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
