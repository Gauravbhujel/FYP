import React from "react";

export function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md ${
        hover
          ? "transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
