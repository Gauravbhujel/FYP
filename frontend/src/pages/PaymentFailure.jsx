import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaRedoAlt } from 'react-icons/fa';

const PaymentFailure = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#fef2f2]">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-6 py-20">
                <div className="max-w-[550px] w-full bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-rose-900/5 text-center border-t-8 border-rose-500">
                    <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-10 transform scale-125">
                        <FaTimesCircle size={40} className="text-rose-500 animate-bounce" />
                    </div>
                    
                    <h1 className="text-4xl font-black text-rose-600 mb-6 tracking-tight">Payment Failed</h1>
                    <p className="text-gray-500 text-lg mb-12 leading-relaxed font-medium">
                        Something went wrong while processing your payment. Don't worry, no funds were deducted from your account. The most common reasons are incorrect login details or insufficient balance.
                    </p>
                    
                    <Link 
                        to="/checkout" 
                        className="bg-rose-600 text-white px-10 py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98] no-underline w-full mb-6"
                    >
                        Try Again <FaRedoAlt size={14} />
                    </Link>
                    
                    <Link 
                        to="/cart" 
                        className="block text-[#ef4444] font-bold text-sm no-underline hover:underline transition-all"
                    >
                        ← Return to Cart
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentFailure;
