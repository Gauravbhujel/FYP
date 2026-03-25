import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95";

  const variants = {
    primary:
      "bg-[#F97316] text-white shadow-sm border border-transparent hover:bg-[#EA580C]",
    secondary:
      "bg-transparent text-gray-900 border border-gray-300 shadow-sm hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
