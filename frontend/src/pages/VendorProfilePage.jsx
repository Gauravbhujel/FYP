import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { 
    FaStore, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaCheckCircle, 
    FaStar,
    FaBoxOpen,
    FaInfoCircle
} from 'react-icons/fa';

const VendorProfilePage = () => {
    const { vendorId } = useParams();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendorDetail = async () => {
            try {
                const response = await api.get(`vendors/${vendorId}/`);
                setVendor(response.data);
            } catch (err) {
                console.error('Error fetching vendor details:', err);
                setError('Vendor not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchVendorDetail();
    }, [vendorId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <FaInfoCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">{error || 'Vendor Not Found'}</h2>
                    <p className="text-gray-500 mb-8 max-w-md">The vendor you are looking for might have closed their store or changed their address.</p>
                    <Link to="/products" className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-2xl font-bold no-underline shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95 hover:brightness-110">
                        Explore Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />
            
            {/* ─── VENDOR HEADER ─── */}
            <div className="bg-white border-b border-gray-200 pt-12 pb-8">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Store Avatar */}
                        <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-light rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl shadow-2xl border-4 border-white">
                            {vendor.store_name?.charAt(0)}
                        </div>
                        
                        <div className="flex-grow">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-4xl font-black text-gray-900">{vendor.store_name}</h1>
                                {vendor.status === 'approved' && (
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-100">
                                        <FaCheckCircle /> Verified Vendor
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-500 font-medium text-lg mb-6 max-w-2xl mx-auto md:mx-0">
                                {vendor.store_name} is a trusted vendor at GearUp Nepal, providing high-quality sports gear and equipment.
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-8 text-sm font-bold text-gray-400">
                                <div className="flex items-center gap-2"><FaEnvelope className="text-primary" /> {vendor.email}</div>
                                <div className="flex items-center gap-2"><FaPhone className="text-primary" /> {vendor.phone}</div>
                                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> {vendor.city}, {vendor.address}</div>
                            </div>
                        </div>
                        
                        {/* Stats Box */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 min-w-[180px]">
                            <div className="text-center">
                                <span className="block text-3xl font-black text-gray-900 mb-1">{vendor.products_count}</span>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                                    <FaBoxOpen className="text-primary" /> Products Listed
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── VENDOR PRODUCTS ─── */}
            <div className="max-w-[1280px] mx-auto px-6 py-16 w-full flex-grow">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">Store Collection</p>
                        <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
                    </div>
                    <div className="text-gray-400 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-gray-100">
                        Total {vendor.products_count} Items
                    </div>
                </div>

                {vendor.products && vendor.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vendor.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <FaBoxOpen size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Products Yet</h3>
                        <p className="text-gray-400 font-medium">This vendor hasn't listed any products available for purchase yet.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default VendorProfilePage;
