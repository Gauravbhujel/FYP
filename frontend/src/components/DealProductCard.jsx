import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCheckCircle, FaFire } from 'react-icons/fa';
import api from '../api';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

const DealProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isAdded, setIsAdded] = React.useState(false);
    const { incrementCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await api.post('cart/add/', {
                product_id: product.id,
                quantity: 1
            });
            incrementCart(1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const discountPct = product.discount || 
        (product.compare_price && product.price 
            ? Math.round((1 - product.price / product.compare_price) * 100) 
            : null);

    return (
        <div className="bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col h-full group hover:shadow-xl hover:scale-[1.02] border border-gray-100/50 shadow-sm">
            {/* Image Section */}
            <Link to={`/product/${product.id}`} className="relative aspect-square bg-[#FDFDFD] rounded-xl overflow-hidden mb-5 block">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Subtle Discount Badge */}
                {discountPct && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <FaFire className="text-accent text-[8px]" />
                        <span>-{discountPct}% OFF</span>
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="flex flex-col flex-grow px-1">
                <Link to={`/product/${product.id}`} className="block mb-2 group-hover:text-accent transition-colors">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-4 flex flex-col gap-4">
                    {/* Price Block */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900">
                            Rs. {Number(product.price).toLocaleString()}
                        </span>
                        {product.compare_price && (
                            <span className="text-xs text-gray-400 line-through font-bold">
                                Rs. {Number(product.compare_price).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Primary Action Button */}
                    <Button 
                        variant="primary"
                        onClick={handleAddToCart}
                        className={`w-full h-11 text-[10px] font-black uppercase tracking-widest gap-2 flex items-center justify-center transition-all ${isAdded ? '!bg-emerald-500 hover:!bg-emerald-600' : 'hover:bg-[#EA580C]'}`}
                    >
                        {isAdded ? (
                            <>
                                <FaCheckCircle size={12} /> Added to Cart
                            </>
                        ) : (
                            <>
                                <FaShoppingCart size={12} /> Grab Deal
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DealProductCard;
