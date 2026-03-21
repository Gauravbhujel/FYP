import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { TrendingUpIcon, PackageIcon } from "lucide-react";

export function TopProducts({ products }) {
  const productList = products && products.length > 0 ? products : [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUpIcon className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-slate-800">Top Products</h3>
        </div>

        <a
          href="/vendor/products"
          className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
        >
          View All
        </a>
      </div>

      {productList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <PackageIcon className="w-10 h-10 mb-2 text-slate-300" />
          <p className="text-sm">No products yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {productList.map((product, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Link to={`/product/${product.id}`} className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden hover:border-orange-500 border border-transparent transition-all">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-semibold text-slate-800 text-sm truncate hover:text-orange-600 transition-colors no-underline block">
                  {product.name}
                </Link>
                <p className="text-xs text-slate-600">{product.sales} sales</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-800">
                  Rs. {product.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
