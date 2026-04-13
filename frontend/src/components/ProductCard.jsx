import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaHeart, FaEye, FaCheckCircle } from 'react-icons/fa';
import api from '../api';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdded, setIsAdded] = React.useState(false);
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
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
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
        (product.compare_price && product.price && Number(product.compare_price) > 0
            ? Math.round((1 - product.price / product.compare_price) * 100)
            : null);

    return (
        <div className="bg-white border border-gray-100 rounded-[1.5rem] p-4 transition-all duration-500 flex flex-col h-full group hover:shadow-xl hover:shadow-accent/5 hover:border-accent/20">

            {/* Image Container */}
            <div className="relative h-[240px] bg-gray-50 rounded-md overflow-hidden mb-4">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${product.quantity <= 0 ? 'grayscale' : ''}`}
                    />
                </Link>

                {/* Sold Out Overlay */}
                {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                        <span className="bg-white/90 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[2px] shadow-lg">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 pointer-events-none" />

                {/* Discount Badge – top left */}
                {discountPct && (
                    <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 animate-fade-in">
                        -{discountPct}%
                    </span>
                )}

                {/* New Badge – top left (if no discount) */}
                {!discountPct && product.is_new && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm z-10">
                        NEW
                    </span>
                )}

                {/* Action Buttons – float in on hover */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10">
                    <button
                        onClick={() => handleAction('wishlist')}
                        className="w-9 h-9 bg-white rounded flex items-center justify-center text-gray-400 shadow-sm transition-all duration-200 border border-gray-100 hover:bg-rose-50 hover:text-rose-500"
                        title="Add to Wishlist"
                    >
                        <FaHeart className="text-sm" />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="w-9 h-9 bg-white rounded flex items-center justify-center text-gray-400 shadow-sm transition-all duration-200 border border-gray-100 hover:bg-accent hover:text-white"
                        title="Quick View"
                    >
                        <FaEye className="text-sm" />
                    </Link>
                </div>
            </div>

            {/* Card Body */}
            <div className="pt-4 pb-2 flex flex-col flex-grow">

                {/* Product Name */}
                <Link to={`/product/${product.id}`} className="no-underline">
                    <h3 className="text-[0.92rem] font-semibold mb-2 text-primary line-clamp-2 leading-snug transition-colors">
                        {product.name}
                    </h3>
                </Link>
                
                {/* Rating Row */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex text-accent text-[9px]">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(product.average_rating || 0) ? "text-accent" : "text-gray-200"} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                        ({product.review_count || 0} reviews)
                    </span>
                </div>
                    {/* Price & Add to Cart button */}
                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-900 leading-none">
                                Rs. {Number(product.price).toLocaleString()}
                            </span>
                            {product.compare_price && (
                                <span className="text-sm text-gray-400 line-through">
                                    Rs. {Number(product.compare_price).toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        <Button 
                            variant="primary"
                            onClick={() => handleAction('cart')}
                            disabled={product.quantity <= 0}
                            className={`w-full py-3 text-xs uppercase tracking-widest gap-2 flex items-center justify-center transition-all ${isAdded ? '!bg-green-500' : ''} ${product.quantity <= 0 ? 'bg-gray-200 text-gray-400 border-gray-100 cursor-not-allowed pointer-events-none' : ''}`}
                        >
                            {product.quantity <= 0 ? (
                                "Unavailable"
                            ) : isAdded ? (
                                <>
                                    <FaCheckCircle size={14} /> Added
                                </>
                            ) : (
                                <>
                                    <FaShoppingCart size={14} /> Add to Cart
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
    );
};

export default ProductCard;
