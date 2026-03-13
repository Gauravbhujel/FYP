import React from "react";
import { Card } from "../ui/Card";

export function RecentProducts({ products }) {
  const productList = products && products.length > 0 ? products : [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Recent Products</h3>
        <a
          href="/vendor/products"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          View All
        </a>
      </div>

      {productList.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <p className="text-sm">No products listed yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Image
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Product Name
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Price
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Stock
                </th>
                <th className="text-left text-xs font-semibold text-slate-600 pb-3">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {productList.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          No Pic
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="py-4 text-sm text-slate-700">
                    {product.category}
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-800">
                    Rs. {product.price}
                  </td>
                  <td className="py-4 text-sm text-slate-700">
                    {product.quantity}
                  </td>
                  <td className="py-4 text-sm text-slate-600">{product.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
