import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { incrementCart, incrementWishlist } = useCart();

    const handleAction = async (actionType) => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            // Redirect to login with current path in state
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

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] group">
            <div className="relative h-[250px] bg-[#f8f9fa] overflow-hidden">
                <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                </Link>
                
                {/* Wishlist Button */}
                <button 
                    onClick={() => handleAction('wishlist')}
                    className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-sm text-[#888] rounded-full border-none cursor-pointer shadow-sm transition-all duration-200 hover:text-[#dc3545] hover:scale-110 z-10 flex items-center justify-center group/wishlist"
                    title="Add to Wishlist"
                >
                    <FaHeart className="text-sm transition-colors group-hover/wishlist:scale-110" />
                </button>

                {product.discount && <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold z-10 bg-[#dc3545] text-white">-{product.discount}%</span>}
                {product.is_new && <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-10 bg-accent text-white">New</span>}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-sm text-[#888] mb-1 uppercase font-medium">{product.category}</span>
                <Link to={`/product/${product.id}`} className="no-underline">
                    <h3 className="text-lg font-semibold mb-2 text-text-dark line-clamp-2 overflow-hidden hover:text-primary transition-colors">{product.name}</h3>
                </Link>

                <div className="flex items-center mb-4">
                    <FaStar className="text-[#ffc107] text-sm" />
                    <FaStar className="text-[#ffc107] text-sm" />
                    <FaStar className="text-[#ffc107] text-sm" />
                    <FaStar className="text-[#ffc107] text-sm" />
                    <FaStar className="text-[#ffc107] text-sm" />
                    <span className="text-[#888] text-xs ml-1.5">(24)</span>
                </div>

                <div className="mb-4 mt-auto">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-text-dark">Rs. {product.price}</span>
                        {product.compare_price && <span className="text-sm text-[#999] line-through ml-2.5">Rs. {product.compare_price}</span>}
                    </div>
                </div>

                <button 
                    onClick={() => handleAction('cart')}
                    className="w-full bg-accent text-white border-none py-3 rounded-md font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:brightness-110 hover:-translate-y-[2px]"
                >
                    <FaShoppingCart /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
