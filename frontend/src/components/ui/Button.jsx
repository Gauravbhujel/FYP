import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow-md hover:shadow-lg",
    secondary:
      "bg-slate-800 text-white hover:bg-slate-900 active:bg-black shadow-md hover:shadow-lg",
    outline:
      "border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white",
    ghost: "text-slate-700 hover:bg-slate-100 active:bg-slate-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
