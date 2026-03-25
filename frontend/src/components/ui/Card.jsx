import React from "react";

export function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
