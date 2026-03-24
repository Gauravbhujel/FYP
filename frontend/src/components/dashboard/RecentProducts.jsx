import React from "react";
import { Link } from "react-router-dom";

export function RecentProducts({ products }) {
  const productList = products && products.length > 0 ? products : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full">
      <div className="flex items-center justify-between p-8 border-b border-gray-100">
        <h3 className="text-sm font-black text-gray-900 tracking-tighter uppercase">Recently Added</h3>
        <a
          href="/vendor/products"
          className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest transition-all"
        >
          Manage Store
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-24">Item</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Stock</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {productList.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                   No storefront items yet
                </td>
              </tr>
            ) : (
              productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded border border-gray-100 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-300">
                            IMG
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Rs. {product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black ${product.quantity < 5 ? 'text-red-500' : 'text-gray-900'} uppercase tracking-widest`}>
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
