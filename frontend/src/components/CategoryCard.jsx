import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export function CategoryCard({ name, image, productCount, slug }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products?category=${slug || name}`)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] transition-all duration-400 hover:-translate-y-1"
    >
      {/* Aspect ratio wrapper */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Hover accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f5132]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
          {/* Product count pill */}
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2 border border-white/25">
            {productCount} products
          </span>

          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-white drop-shadow-md leading-tight">
              {name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
              <FaArrowRight className="text-white text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
