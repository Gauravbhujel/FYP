import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export function CategoryCard({ name, image, productCount, slug }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products?category=${slug || name}`)}
      className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Aspect ratio wrapper */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
          {/* Product count pill */}
          <span className="inline-block bg-white text-primary text-[11px] font-semibold px-2.5 py-1 rounded mb-2 shadow-sm">
            {productCount} products
          </span>

          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-white leading-tight">
              {name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300 shadow-sm">
              <FaArrowRight className="text-primary text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
