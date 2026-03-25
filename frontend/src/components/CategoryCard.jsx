import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export function CategoryCard({ name, image, productCount, slug }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products?category=${slug || name}`)}
      className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-gray-200"
    >
      {/* Aspect ratio wrapper */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/40 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-transform duration-300">
          {/* Product count pill */}
          <span className="inline-block bg-white text-primary text-[11px] font-semibold px-2.5 py-1 rounded mb-2 shadow-sm">
            {productCount} products
          </span>

          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-white leading-tight">
              {name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:bg-accent group-hover:text-white">
              <FaArrowRight className="text-primary text-xs group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
