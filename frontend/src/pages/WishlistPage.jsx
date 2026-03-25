import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { resetWishlist } = useCart();

    useEffect(() => {
        fetchWishlist();
        resetWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await api.get('wishlist/');
            setWishlistItems(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.post(`wishlist/remove/${itemId}/`);
            setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item');
        }
    };

    const addToCart = async (product) => {
        try {
            const response = await api.post('cart/add/', {
                product_id: product.id,
                quantity: 1
            });
            alert(response.data.message || "Added to cart!");
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert("Failed to add to cart");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 py-12 flex-grow w-full">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <FaHeart className="text-red-500" size={28} /> My Wishlist
                    </h1>
                    <span className="bg-white px-4 py-2 rounded-full font-bold text-gray-500 shadow-sm border text-sm">
                        {wishlistItems.length} Products
                    </span>
                </div>
                
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group product-card border border-gray-100 flex flex-col h-full">
                                    <Link to={`/product/${item.product.id}`} className="block relative h-64 overflow-hidden bg-gray-50 border-b border-gray-100">
                                        <img 
                                            src={item.product.image || 'https://via.placeholder.com/300'} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.id); }}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded flex items-center justify-center text-gray-400 shadow-sm border-none cursor-pointer transition-colors hover:text-red-500 z-10"
                                            title="Remove from Wishlist"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </Link>
                                
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.product.category_display}</span>
                                        <Link to={`/product/${item.product.id}`} className="no-underline">
                                            <h3 className="text-lg font-bold text-primary mt-1 line-clamp-2 hover:text-gray-700 transition-colors">{item.product.name}</h3>
                                        </Link>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-xl font-black text-primary">Rs. {Number(item.product.price).toLocaleString()}</span>
                                            <button 
                                                onClick={() => addToCart(item.product)}
                                                className="bg-accent text-white p-3 rounded flex items-center justify-center transition-colors hover:bg-opacity-90 border-none cursor-pointer shadow-sm"
                                                title="Add to Cart"
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
                        <div className="bg-gray-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FaHeart size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-primary mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed text-lg">See something you like? Add it to your wishlist so you can find it later!</p>
                        <Link to="/products" className="inline-flex items-center justify-center bg-[#F97316] text-white hover:bg-[#EA580C] px-12 py-5 rounded-lg font-bold transition-all shadow-sm hover:shadow-md no-underline text-lg">
                            Browse Best Gear
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;
