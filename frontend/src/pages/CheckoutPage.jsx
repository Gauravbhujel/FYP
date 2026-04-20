import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [savedAddress, setSavedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(''); // 'EPAY' or 'COD'
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('user/profile/');
            if (response.data.address) {
                setSavedAddress(response.data.address);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await api.get('cart/');
            setCartItems(response.data);
            if (response.data.length === 0) {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!shippingAddress) {
            alert('Please provide a shipping address');
            return;
        }

        setProcessing(true);
        try {
            const response = await api.post('checkout/initiate/', {
                cart_items: cartItems.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                })),
                shipping_address: shippingAddress,
                payment_method: paymentMethod
            });
            
            if (paymentMethod === 'COD') {
                navigate(`/payment-success?oid=${response.data.transaction_uuid}&method=COD`);
                return;
            }

            const paymentData = response.data;
            
            // Redirect to eSewa by submitting a hidden form
            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', paymentData.esewa_url);

            const fields = [
                'amount', 'tax_amount', 'total_amount', 'transaction_uuid', 
                'product_code', 'product_service_charge', 'product_delivery_charge', 
                'success_url', 'failure_url', 'signed_field_names', 'signature'
            ];

            fields.forEach(field => {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', field);
                hiddenField.setAttribute('value', paymentData[field]);
                form.appendChild(hiddenField);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to initiate payment. Please try again.';
            alert(errorMessage);
            setProcessing(false);
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
            <div className="max-w-[1000px] mx-auto px-6 py-12 flex-grow w-full">
                <h1 className="text-3xl font-bold mb-10 text-primary">Checkout</h1>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Details */}
                    <div className="flex-grow">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold text-text-dark">Shipping Information</h2>
                                {savedAddress && (
                                    <button 
                                        type="button"
                                        onClick={() => setShippingAddress(savedAddress)}
                                        className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all border-b-2 border-primary/20 pb-0.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Use Saved Address
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleCheckout}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        Shipping Address
                                    </label>
                                    <textarea 
                                        required
                                        rows="4"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none transition-all"
                                        placeholder="Full address (Street, City, State, ZIP)"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                    ></textarea>
                                </div>
                                
                                <h2 className="text-xl font-bold mb-6 text-text-dark mt-10">Payment Method</h2>
                                <div className="space-y-4 mb-10">
                                    {/* eSewa Option */}
                                    <div 
                                        onClick={() => setPaymentMethod('EPAY')}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'EPAY' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'EPAY' ? 'border-primary bg-white' : 'border-gray-200 bg-white'}`}>
                                            {paymentMethod === 'EPAY' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-bold ${paymentMethod === 'EPAY' ? 'text-primary' : 'text-gray-700'}`}>eSewa Mobile Wallet</p>
                                            <p className="text-xs text-gray-500">Pay securely via eSewa Portal</p>
                                        </div>
                                        <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-8" />
                                    </div>

                                    {/* COD Option */}
                                    <div 
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary bg-white' : 'border-gray-200 bg-white'}`}>
                                            {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-bold ${paymentMethod === 'COD' ? 'text-primary' : 'text-gray-700'}`}>Cash on Delivery (COD)</p>
                                            <p className="text-xs text-gray-500">Pay in cash upon receiving your order</p>
                                        </div>
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={processing}
                                    className="w-full py-5 text-xl rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {processing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : `Pay Rs. ${calculateTotal().toLocaleString()}`}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Snapshot */}
                    <div className="w-full lg:w-[350px]">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-6 text-text-dark">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-800">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="flex justify-between items-center font-extrabold text-xl text-text-dark">
                                    <span>Total Payable</span>
                                    <span className="text-primary text-2xl font-black">Rs. {calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
