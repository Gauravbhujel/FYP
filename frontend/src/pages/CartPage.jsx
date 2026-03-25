import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { Button } from '../components/ui/Button';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { resetCart } = useCart();

    useEffect(() => {
        fetchCart();
        resetCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('cart/');
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.post(`cart/remove/${itemId}/`);
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString();
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
                <h1 className="text-3xl font-bold mb-10 text-primary">Your Shopping Cart</h1>
                
                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                <div className="hidden md:grid grid-cols-4 gap-4 p-5 bg-gray-50/50 border-b font-semibold text-gray-500 text-sm uppercase tracking-wider">
                                    <div className="col-span-2">Product Details</div>
                                    <div className="text-center">Quantity</div>
                                    <div className="text-right">Price</div>
                                </div>
                                
                                {cartItems.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b last:border-b-0 transition-colors">
                                        <div className="col-span-2 flex gap-5">
                                            <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 block transition-colors">
                                                <img 
                                                    src={item.product.image || 'https://via.placeholder.com/150'} 
                                                    alt={item.product.name} 
                                                    className="w-full h-full object-cover transition-transform"
                                                />
                                            </Link>
                                            <div className="flex flex-col justify-center">
                                                <Link to={`/product/${item.product.id}`} className="no-underline">
                                                    <h3 className="font-bold text-primary text-lg mb-1 transition-colors">{item.product.name}</h3>
                                                </Link>
                                                <p className="text-sm text-gray-500 mb-3">{item.product.category_display}</p>
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-[#ef4444] text-sm flex items-center gap-1.5 border-none bg-transparent cursor-pointer p-0 font-medium transition-colors"
                                                >
                                                    <FaTrash size={12} /> Remove Item
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent cursor-pointer transition-colors text-gray-600"><FaMinus size={10} /></button>
                                                <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent cursor-pointer transition-colors text-gray-600"><FaPlus size={10} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end font-bold text-xl text-text-dark">
                                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-[380px] h-fit">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold mb-8 text-text-dark">Order Summary</h2>
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-text-dark">Rs. {calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Taxes</span>
                                        <span className="text-text-dark">Included</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-5 flex justify-between font-extrabold text-2xl text-text-dark">
                                        <span>Total</span>
                                        <span className="text-primary">Rs. {calculateTotal()}</span>
                                    </div>
                                </div>
                                <Button variant="primary" className="w-full text-lg mb-4 py-4 rounded font-bold shadow-sm">
                                    Proceed to Checkout
                                </Button>
                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Secure Payments</span>
                                </div>
                            </div>
                            <Link to="/products" className="block text-center mt-8 text-gray-500 font-bold no-underline transition-colors">
                                ← Back to Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
                        <div className="bg-gray-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FaShoppingCart size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-primary mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed text-lg">Looks like you haven't added any gear to your cart yet. Time to gear up!</p>
                        <Link to="/products" className="inline-flex items-center justify-center bg-[#F97316] text-white px-12 py-5 rounded-lg font-bold transition-all shadow-sm no-underline text-lg">
                            Explore Products
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
