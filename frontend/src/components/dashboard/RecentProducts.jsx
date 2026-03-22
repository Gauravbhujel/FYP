import React from "react";
import { Link } from "react-router-dom";

export function RecentProducts({ products }) {
  const productList = products && products.length > 0 ? products : [];

  return (
    <div className="dashboard-card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-50">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Recently Added</h3>
        <a
          href="/vendor/products"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
        >
          Manage Store
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Preview</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Inventory</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {productList.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                   No products in your catalog yet
                </td>
              </tr>
            ) : (
              productList.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/product/${product.id}`} className="block h-10 w-10 rounded-xl overflow-hidden border border-slate-100 group-hover:border-emerald-500 transition-all shadow-sm">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300">
                          N/A
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/product/${product.id}`} className="text-sm font-bold text-slate-800 tracking-tight hover:text-emerald-600 transition-colors line-clamp-1">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">Rs. {product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-extrabold ${product.quantity < 5 ? 'text-rose-500' : 'text-slate-700'}`}>
                      {product.quantity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
