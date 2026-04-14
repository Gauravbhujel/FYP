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
      "bg-accent text-white shadow-lg border border-transparent hover:bg-accent-dark hover:shadow-accent/40 active:scale-95 transition-all duration-300",
    secondary:
      "bg-transparent text-accent border-2 border-accent/40 hover:bg-accent hover:text-white hover:border-accent hover:shadow-lg hover:shadow-accent/30 active:scale-95 transition-all duration-300",
    outline:
      "bg-transparent text-gray-600 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-all duration-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] font-black uppercase tracking-widest",
    md: "px-8 py-3.5 text-xs font-black uppercase tracking-widest",
    lg: "px-10 py-4 text-sm font-black uppercase tracking-widest",
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
