import React from "react";
import { Card } from "./ui/Card";

export function CategoryCard({ name, image, productCount }) {
  return (
    <Card hover className="overflow-hidden group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-xl mb-1">{name}</h3>
          <p className="text-sm text-white/90">{productCount} products</p>
        </div>
      </div>
    </Card>
  );
}
