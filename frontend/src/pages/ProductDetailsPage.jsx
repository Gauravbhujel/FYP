import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useCart } from '../context/CartContext';
import { 
    FaShoppingCart, 
    FaHeart, 
    FaStar, 
    FaArrowLeft, 
    FaCheckCircle, 
    FaTruck, 
    FaShieldAlt, 
    FaSyncAlt, 
    FaGem,
    FaStore,
    FaInfoCircle,
    FaStarHalfAlt,
    FaRegStar
} from 'react-icons/fa';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { incrementCart, incrementWishlist } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState(null); // Renamed from selectedImage
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`products/${productId}/`);
                setProduct(response.data);
                setMainImage(response.data.image);
                setReviews(response.data.reviews || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found');
                setLoading(false);
            }
        };

        const fetchEligibility = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get(`products/${productId}/review/check-eligibility/`);
                    setCanReview(response.data.can_review);
                    setHasPurchased(response.data.has_purchased);
                    if (response.data.existing_review) {
                        setUserReview(response.data.existing_review);
                    }
                } catch (err) {
                    console.error('Error checking review eligibility:', err);
                }
            }
        };

        fetchProduct();
        fetchEligibility();
    }, [productId, isAuthenticated]);

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
                    quantity: quantity
                });
                incrementCart(quantity);
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userReview.rating) {
            alert('Please select a rating');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const response = await api.post(`products/${productId}/review/submit/`, userReview);
            alert(response.data.message);
            // Refresh product data to show new review
            const productRes = await api.get(`products/${productId}/`);
            setProduct(productRes.data);
            setReviews(productRes.data.reviews || []);
        } catch (err) {
            console.error('Error submitting review:', err);
            alert(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const renderStars = (rating, interactive = false) => {
        return (
            <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && setUserReview(prev => ({ ...prev, rating: star }))}
                        className={`${interactive ? 'hover:scale-110 transition-transform focus:outline-none' : ''}`}
                    >
                        {star <= (interactive ? userReview.rating : rating) ? <FaStar /> : <FaRegStar className="text-gray-300" />}
                    </button>
                ))}
            </div>
        );
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

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <FaInfoCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Product Not Found</h2>
                    <p className="text-gray-500 mb-8 max-w-md">The product you are looking for might have been moved or is currently out of stock.</p>
                    <Link to="/products" className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-2xl font-bold no-underline shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all">
                        Explore Catalog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Derived values
    const discountPct = product.discount || (product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />
            
            <div className="max-w-[1280px] mx-auto px-6 py-8 w-full flex-grow">
                {/* ─── BREADCRUMBS ─── */}
                <nav className="flex items-center gap-3 mb-8 text-sm font-medium text-gray-400 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">Home</Link>
                    <span className="text-gray-300">/</span>
                    <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                    <span className="text-gray-300">/</span>
                    <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors uppercase tracking-wider text-[11px]">{product.category}</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-bold truncate">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-start">
                    {/* ─── LEFT: IMAGE GALLERY ─── */}
                    <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col gap-6 lg:sticky lg:top-32">
                        <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 group">
                            {/* Tags */}
                            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                                {product.is_new && (
                                    <span className="bg-gradient-to-r from-accent to-accent-light text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">New Arrival</span>
                                )}
                                {discountPct > 0 && (
                                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Save {discountPct}%</span>
                                )}
                            </div>

                            <div className="aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-50">
                                <img 
                                    src={mainImage || 'https://via.placeholder.com/800'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            </div>

                            {/* Main Image Overlay Info */}
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-700 border border-white/50 shadow-sm flex items-center gap-2">
                                    <FaCheckCircle className="text-emerald-500" /> Premium Quality Inspected
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {[product.image, product.image2, product.image3].filter(img => img).map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary shadow-lg ring-4 ring-primary/10' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── RIGHT: PRODUCT INFO ─── */}
                    <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col">
                        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                            {/* Headers */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-primary/10 text-primary-dark font-black uppercase tracking-[0.15em] text-[10px] px-3 py-1 rounded-lg">{product.category}</span>
                                    {product.is_featured && (
                                        <span className="flex items-center gap-1 text-amber-500 font-bold text-[11px] uppercase tracking-widest ml-1">
                                            <FaGem /> Editor's Choice
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>
                                
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                        <div className="flex items-center text-amber-500 text-sm">
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                                        </div>
                                        <span className="text-amber-800 font-black text-sm">4.8</span>
                                    </div>
                                    <span className="text-gray-400 font-bold text-xs hover:text-primary transition-colors cursor-pointer decoration-dotted underline underline-offset-4">128 Customer Reviews</span>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">In Stock</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="flex flex-col gap-1 mb-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Rs. {Number(product.price).toLocaleString()}</span>
                                    {product.compare_price && (
                                        <span className="text-xl text-gray-300 line-through font-bold">Rs. {Number(product.compare_price).toLocaleString()}</span>
                                    )}
                                </div>
                                {discountPct > 0 && (
                                    <p className="text-red-500 text-sm font-bold flex items-center gap-1.5">
                                        🏷️ You save Rs. {(product.compare_price - product.price).toLocaleString()} ({discountPct}%)
                                    </p>
                                )}
                            </div>

                            {/* Quick Product Summary */}
                            <p className="text-gray-500 text-base leading-relaxed mb-10 line-clamp-3">
                                {product.description?.split('\n')[0] || "Elevate your performance with this premium gear from Nepal's most trusted sports marketplace."}
                            </p>

                            {/* Actions Card */}
                            <div className="bg-gray-50/50 rounded-[2rem] p-6 mb-8 border border-gray-100">
                                <div className="flex flex-col gap-6">
                                    {/* Qty & Add to Cart Row */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center bg-white p-1 rounded-2xl border border-gray-200 shadow-sm w-full sm:w-auto">
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-all text-xl font-bold text-gray-400 hover:text-primary"
                                            >-</button>
                                            <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-all text-xl font-bold text-gray-400 hover:text-primary"
                                            >+</button>
                                        </div>
                                        <button 
                                            onClick={() => handleAction('cart')}
                                            className="w-full sm:flex-grow bg-gradient-to-r from-primary to-primary-light text-white py-4.5 rounded-[1.25rem] font-black text-lg shadow-[0_15px_30px_rgba(15,81,50,0.25)] hover:shadow-[0_20px_40px_rgba(15,81,50,0.35)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                                        >
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                    </div>
                                    
                                    {/* Wishlist & Buy Now (Secondary Actions) */}
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleAction('wishlist')}
                                            className="flex-grow bg-white border border-gray-200 text-gray-700 py-4 rounded-[1.25rem] font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <FaHeart className="text-gray-300 group-hover:text-red-500 transition-colors" /> Save to Wishlist
                                        </button>
                                        <button 
                                            onClick={() => alert("Redirecting to checkout...")}
                                            className="flex-grow bg-[#111827] text-white py-4 rounded-[1.25rem] font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center"
                                        >
                                            Buy It Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges Simple */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-primary text-sm">
                                        <FaTruck />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-[11px] text-gray-900">Swift Delivery</span>
                                        <span className="block text-[10px] text-gray-400">Nepal wide</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">
                                        <FaShieldAlt />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-[11px] text-gray-900">Brand Direct</span>
                                        <span className="block text-[10px] text-gray-400">Genuine Gear</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── VENDOR CARD ─── */}
                        <div className="mt-8 bg-gradient-to-br from-white to-gray-50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-white">
                                        {product.vendor_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h4 className="text-lg font-black text-gray-900">{product.vendor_name}</h4>
                                            <FaCheckCircle className="text-blue-500 text-xs" title="Verified Vendor" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-amber-500 text-[10px]"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Rated Seller</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/vendor/${product.vendor_id || ''}`} className="bg-white border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <FaStore /> Visit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── INFORMATION TABS ─── */}
                <div className="mt-20">
                    <div className="flex items-center justify-center border-b border-gray-200 gap-1 sm:gap-12 mb-12 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'description', label: 'Description', icon: <FaInfoCircle /> },
                            { id: 'specifications', label: 'Technical Details', icon: <FaGem /> },
                            { id: 'reviews', label: 'Customer Reviews', icon: <FaStar /> },
                            { id: 'shipping', label: 'Shipping & Returns', icon: <FaSyncAlt /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-6 px-4 font-black text-sm transition-all relative whitespace-nowrap ${
                                    activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <span className="text-xs">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fade-in"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <div className="animate-fade-up">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">Uncompromising Performance</h3>
                                <div className="prose prose-lg max-w-none text-gray-600 leading-loose">
                                    {product.description?.split('\n').map((para, i) => (
                                        <p key={i} className="mb-6">{para}</p>
                                    )) || <p>No detailed description available.</p>}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'specifications' && (
                            <div className="animate-fade-up grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                {[
                                    { label: 'Category', value: product.category },
                                    { label: 'Vendor', value: product.vendor_name },
                                    { label: 'Authenticity', value: '100% Genuine Gear' },
                                    { label: 'Warranty', value: '6 Months Limited' },
                                    { label: 'Condition', value: 'Factory Brand New' },
                                    { label: 'SKU', value: `GN-${product.id}00${product.id}` }
                                ].map((spec, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                                        <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">{spec.label}</span>
                                        <span className="text-gray-900 font-black text-sm">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-fade-up space-y-12">
                                {/* Aggregate Section */}
                                <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <div className="text-center">
                                        <div className="text-7xl font-black text-gray-900 mb-2">{product.average_rating?.toFixed(1) || '0.0'}</div>
                                        {renderStars(product.average_rating || 0)}
                                        <div className="text-gray-400 font-bold text-sm mt-3 uppercase tracking-widest">{reviews.length} Reviews</div>
                                    </div>
                                    
                                    <div className="flex-grow space-y-3 w-full">
                                        {[5, 4, 3, 2, 1].map(num => {
                                            const count = reviews.filter(r => r.rating === num).length;
                                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={num} className="flex items-center gap-4">
                                                    <span className="text-sm font-black text-gray-400 w-4">{num}</span>
                                                    <div className="flex-grow h-2 bg-gray-50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 w-8">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="space-y-8">
                                    {reviews.length > 0 ? (
                                        reviews.map((review, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-black text-gray-900">{review.customer_name}</span>
                                                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                                                                <FaCheckCircle className="text-[8px]" /> Verified Purchase
                                                            </span>
                                                        </div>
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="text-gray-200 text-6xl mb-4 font-black">No Reviews Yet</div>
                                            <p className="text-gray-400 font-medium">Be the first to share your experience with this gear.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Review Form */}
                                <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-3xl font-black mb-2 italic">Gear Check?</h3>
                                        <p className="text-gray-400 mb-8 font-medium">Your feedback helps the community choose the best equipment.</p>

                                        {isAuthenticated ? (
                                            canReview ? (
                                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                                    <div>
                                                        <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Your Rating</label>
                                                        {renderStars(0, true)}
                                                    </div>
                                                    <div>
                                                        <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Your Commentary</label>
                                                        <textarea 
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary transition-all min-h-[120px] font-medium"
                                                            placeholder="Tell us about the performance, durability, and fit..."
                                                            value={userReview.comment}
                                                            onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                                                        ></textarea>
                                                    </div>
                                                    <button 
                                                        type="submit"
                                                        disabled={isSubmittingReview}
                                                        className="w-full h-16 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[0.98] transition-all disabled:opacity-50"
                                                    >
                                                        {isSubmittingReview ? 'Submitting...' : 'Post Commentary'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                                                    <p className="text-amber-400 font-black italic">
                                                        {hasPurchased 
                                                            ? "Only delivered orders can be reviewed. Please wait for your gear to arrive!"
                                                            : "Only verified purchasers of this product can leave a review."}
                                                    </p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-center py-4">
                                                <Link to="/login" className="text-primary font-black hover:underline uppercase tracking-widest">Login to Leave a Review</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="animate-fade-up space-y-8">
                                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                                    <h4 className="text-lg font-black text-blue-900 mb-3 flex items-center gap-2">
                                        <FaTruck /> Delivery Timelines
                                    </h4>
                                    <p className="text-blue-800/70 text-sm leading-relaxed">
                                        Inside Kathmandu Valley: Same day or next day delivery. <br />
                                        Outside Valley: 3-5 business days via trusted logistics partners.
                                    </p>
                                </div>
                                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                                    <h4 className="text-lg font-black text-amber-900 mb-3 flex items-center gap-2">
                                        <FaSyncAlt /> Easy Returns
                                    </h4>
                                    <p className="text-amber-800/70 text-sm leading-relaxed">
                                        Not the right fit? Return within 7 days for a hassle-free exchange. No questions asked if the seal is intact.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
