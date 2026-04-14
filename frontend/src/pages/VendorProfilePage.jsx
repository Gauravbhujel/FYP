import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'reviews'
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

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
    }, [vendorId, navigate]);

    const handleStartChat = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const response = await api.post('chat/get_or_create/', {
                vendor_profile_id: vendor.id
            });
            navigate(`/chat/${response.data.id}`);
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Failed to start chat with vendor.');
        }
    };

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

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                        key={star}
                        className={`text-xs ${star <= rating ? 'text-amber-400' : 'text-gray-100'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />
            
            {/* ─── VENDOR HEADER ─── */}
            <div className="bg-white border-b border-gray-200 pt-12 pb-8">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {/* Store Avatar */}
                        <div className="w-32 h-32 bg-accent rounded-[2rem] flex items-center justify-center text-white font-black text-5xl">
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
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-8 text-sm font-bold text-gray-400 mb-6">
                                <div className="flex items-center gap-2"><FaEnvelope className="text-accent" /> {vendor.email}</div>
                                <div className="flex items-center gap-2"><FaPhone className="text-accent" /> {vendor.phone}</div>
                                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-accent" /> {vendor.city}, {vendor.address}</div>
                            </div>

                            <button 
                                onClick={handleStartChat}
                                className="bg-blue-600 text-white font-black text-sm px-8 py-3.5 rounded-2xl transition-all flex items-center gap-2.5 hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95"
                            >
                                <MessageSquare size={18} /> Start Real-time Chat
                            </button>
                        </div>
                        
                        {/* Stats Boxes */}
                        <div className="flex gap-4">
                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 min-w-[150px] text-center">
                                <span className="block text-3xl font-black text-gray-900 mb-1">{vendor.products_count || 0}</span>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                                    <FaBoxOpen className="text-accent" /> Products
                                </span>
                            </div>
                            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 min-w-[150px] text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <span className="text-3xl font-black text-gray-900">{(vendor.average_rating || 0).toFixed(1)}</span>
                                    <FaStar className="text-amber-500 text-xl" />
                                </div>
                                <span className="block text-[10px] font-black text-amber-700 uppercase tracking-widest">
                                    {vendor.review_count || 0} Reviews
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── TABS ─── */}
            <div className="max-w-[1280px] mx-auto px-6 mt-12">
                <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-white border border-gray-100 rounded-3xl w-fit shadow-sm">
                     <button
                        onClick={() => setActiveTab('products')}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                            activeTab === 'products' 
                                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                                : 'text-gray-400 hover:text-accent hover:bg-accent/5'
                        }`}
                    >
                        <FaBoxOpen className={activeTab === 'products' ? 'text-white' : 'text-gray-200'} />
                        Products Collection
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                            activeTab === 'reviews' 
                                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                                : 'text-gray-400 hover:text-accent hover:bg-accent/5'
                        }`}
                    >
                        <FaStar className={activeTab === 'reviews' ? 'text-white' : 'text-gray-200'} />
                        Service Reviews ({vendor.vendor_reviews?.length || 0})
                    </button>
                </div>
            </div>

            {/* ─── TAB CONTENT ─── */}
            <div className="max-w-[1280px] mx-auto px-6 py-12 w-full flex-grow">
                {activeTab === 'products' ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">Store Collection</p>
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
                ) : (
                    <div className="animate-fade-in max-w-4xl">
                        <div className="mb-12">
                            <p className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">User Feedback</p>
                            <h2 className="text-3xl font-black text-gray-900">Vendor Service Experience</h2>
                        </div>

                        {vendor.vendor_reviews && vendor.vendor_reviews.length > 0 ? (
                            <div className="space-y-6">
                                {vendor.vendor_reviews.map((review, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-accent font-black text-sm border border-accent/10">
                                                    {review.customer_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-gray-900 text-sm">{review.customer_name}</span>
                                                        <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                                            <FaCheckCircle className="text-[7px]" /> Verified Purchase
                                                        </span>
                                                    </div>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-200 mx-auto mb-6">
                                    <FaStar size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Service Reviews</h3>
                                <p className="text-gray-400 font-medium">Be the first to rate this vendor's service after your purchase!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default VendorProfilePage;
