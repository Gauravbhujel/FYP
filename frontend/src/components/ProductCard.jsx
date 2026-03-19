import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaHeart, FaEye } from 'react-icons/fa';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { incrementCart, incrementWishlist } = useCart();

    const handleAction = async (actionType) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            if (actionType === 'cart') {
                const response = await api.post('cart/add/', {
                    product_id: product.id,
                    quantity: 1
                });
                incrementCart(1);
                alert(response.data.message || "Added to cart!");
            } else if (actionType === 'wishlist') {
                const response = await api.post('wishlist/add/', {
                    product_id: product.id
                });
                incrementWishlist(1);
                alert(response.data.message || "Added to wishlist!");
            }
        } catch (error) {
            console.error(`Error adding to ${actionType}:`, error);
            alert(`Failed to add to ${actionType}. Please try again.`);
        }
    };

    // Calculate discount percentage if compare_price is available
    const discountPct = product.discount ||
        (product.compare_price && product.price
            ? Math.round((1 - product.price / product.compare_price) * 100)
            : null);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-all duration-350 flex flex-col h-full group hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] hover:border-gray-200">

            {/* Image Container */}
            <div className="relative h-[260px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                </Link>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />

                {/* Discount Badge – top left */}
                {discountPct && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                        -{discountPct}%
                    </span>
                )}

                {/* New Badge – top left (if no discount) */}
                {!discountPct && product.is_new && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-[#ff6b00] to-[#ff9d3d] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                        NEW
                    </span>
                )}

                {/* Action Buttons – float in on hover */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
                    <button
                        onClick={() => handleAction('wishlist')}
                        className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 shadow-md hover:text-red-500 hover:scale-110 transition-all duration-200 border border-white/50"
                        title="Add to Wishlist"
                    >
                        <FaHeart className="text-sm" />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 shadow-md hover:text-[#0f5132] hover:scale-110 transition-all duration-200 border border-white/50"
                        title="Quick View"
                    >
                        <FaEye className="text-sm" />
                    </Link>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                <span className="text-[11px] text-[#ff6b00] font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                </span>

                {/* Product Name */}
                <Link to={`/product/${product.id}`} className="no-underline">
                    <h3 className="text-[0.92rem] font-semibold mb-2 text-gray-800 line-clamp-2 leading-snug hover:text-[#0f5132] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                    <span className="text-[11px] text-gray-400 ml-1 font-medium">(24)</span>
                </div>

                {/* Spacer */}
                <div className="mt-auto">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-extrabold text-gray-900">
                            Rs. {Number(product.price).toLocaleString()}
                        </span>
                        {product.compare_price && (
                            <span className="text-sm text-gray-400 line-through font-medium">
                                Rs. {Number(product.compare_price).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => handleAction('cart')}
                        className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c38] text-white border-none py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:from-[#cc5200] hover:to-[#ff6b00] hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/30 active:translate-y-0"
                    >
                        <FaShoppingCart className="text-sm" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
