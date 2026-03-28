import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('oid');

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-6 py-20">
                <div className="max-w-[600px] w-full bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-emerald-900/5 text-center border-t-8 border-emerald-500">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 transform scale-125">
                        <FaCheckCircle size={40} className="text-emerald-500 animate-pulse" />
                    </div>
                    
                    <h1 className="text-4xl font-black text-emerald-600 mb-6 tracking-tight">Payment Successful!</h1>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                        Your gear is being prepped for the journey! We've received your payment and your order is now being processed.
                    </p>
                    
                    {orderId && (
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-12 flex justify-between items-center text-sm font-bold text-emerald-800 uppercase tracking-widest">
                            <span>Transaction UUID</span>
                            <span>{orderId.slice(0, 8)}...{orderId.slice(-8)}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-center">
                        <Link 
                            to="/products" 
                            className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] no-underline"
                        >
                            Continue Shopping <FaArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
