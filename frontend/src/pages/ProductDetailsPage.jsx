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
    FaCheckCircle, 
    FaTruck, 
    FaShieldAlt, 
    FaSyncAlt, 
    FaGem,
    FaStore,
    FaInfoCircle,
    FaRegStar,
    FaBolt,
    FaBoxOpen,
    FaAward,
    FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { MessageSquare } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { incrementCart, incrementWishlist } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState(null);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loadingSimilar, setLoadingSimilar] = useState(true);
    const { isAuthenticated, token } = useAuth();

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

        const fetchSimilar = async () => {
            try {
                const response = await api.get(`products/${productId}/similar/`);
                setSimilarProducts(response.data);
            } catch (err) {
                console.error('Error fetching similar products:', err);
            } finally {
                setLoadingSimilar(false);
            }
        };

        fetchProduct();
        fetchEligibility();
        fetchSimilar();
    }, [productId, isAuthenticated]);

    // Handle tab switching from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab && ['description', 'specifications', 'reviews', 'shipping'].includes(tab)) {
            setActiveTab(tab);
            // Scroll to tabs section after a short delay for content to load
            setTimeout(() => {
                const tabsElement = document.getElementById('product-tabs');
                if (tabsElement) {
                    tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }, [location.search]);

    const handleAction = async (actionType) => {
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
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
                alert(response.data.message || "Added to cart!");
            } else if (actionType === 'wishlist') {
                const response = await api.post('wishlist/add/', {
                    product_id: product.id
                });
                incrementWishlist(1);
                setIsWishlisted(true);
                alert(response.data.message || "Added to wishlist!");
            }
        } catch (error) {
            console.error(`Error adding to ${actionType}:`, error);
            alert(`Failed to add to ${actionType}. Please try again.`);
        }
    };
    
    const handleBuyNow = async () => {
        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            await api.post('cart/add/', {
                product_id: product.id,
                quantity: quantity
            });
            incrementCart(quantity);
            navigate('/checkout');
        } catch (error) {
            console.error('Error in Buy It Now:', error);
            alert('Failed to process Buy It Now. Please try again.');
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

    const handleStartChat = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const response = await api.post('chat/get_or_create/', {
                vendor_profile_id: product.vendor_id
            });
            navigate(`/chat/${response.data.id}`);
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Failed to start chat with vendor.');
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
                        className={`${interactive ? 'focus:outline-none cursor-pointer' : ''}`}
                    >
                        {star <= (interactive ? userReview.rating : rating) ? <FaStar /> : <FaRegStar className="text-gray-300" />}
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
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
            <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                        <FaInfoCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Product Not Found</h2>
                    <p className="text-gray-500 mb-8 max-w-md">The product you are looking for might have been moved or is currently out of stock.</p>
                    <Button variant="primary" onClick={() => navigate('/products')} className="px-8 py-4">
                        Explore Catalog
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const discountPct = product.discount || (product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0);
    const allImages = [product.image, product.image2, product.image3].filter(img => img);

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFBFC] font-sans">
            <Navbar />
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 w-full flex-grow">
                {/* ─── BREADCRUMBS ─── */}
                <nav className="flex items-center gap-2 mb-8 text-xs font-bold text-gray-400 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <Link to="/" className="transition-colors">Home</Link>
                    <FaChevronRight className="text-[8px] text-gray-300" />
                    <Link to="/products" className="transition-colors">Products</Link>
                    <FaChevronRight className="text-[8px] text-gray-300" />
                    <Link to={`/products?category=${product.category}`} className="transition-colors uppercase tracking-wider">{product.category}</Link>
                    <FaChevronRight className="text-[8px] text-gray-300" />
                    <span className="text-gray-700 truncate">{product.name}</span>
                </nav>

                {/* ═══════════ MAIN PRODUCT SECTION ═══════════ */}
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 items-start">
                    
                    {/* ─── LEFT: IMAGE GALLERY ─── */}
                    <div className="w-full lg:w-[48%] xl:w-[50%] lg:sticky lg:top-28">
                        <div className="relative bg-white rounded overflow-hidden group">
                            {/* Badges */}
                            <div className="absolute top-5 left-5 z-10 flex flex-col gap-2.5">
                                {product.is_new && (
                                    <span className="bg-accent text-white px-4 py-1.5 rounded font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                        <FaBolt className="text-[8px]" /> New Arrival
                                    </span>
                                )}
                                {discountPct > 0 && (
                                    <span className="bg-accent text-white px-4 py-1.5 rounded font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20">
                                        Save {discountPct}%
                                    </span>
                                )}
                            </div>

                            {/* Wishlist button floating */}
                            <button 
                                onClick={() => handleAction('wishlist')}
                                className={`absolute top-5 right-5 z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md ${
                                    isWishlisted 
                                        ? 'bg-red-500 text-white shadow-red-500/30' 
                                        : 'bg-white/80 text-gray-400 shadow-black/5'
                                }`}
                            >
                                <FaHeart className={`transition-transform ${isWishlisted ? 'scale-110' : ''}`} />
                            </button>

                            {/* Main Image */}
                            <div className="aspect-[4/4] sm:aspect-[5/4] overflow-hidden bg-gray-50">
                                <img 
                                    src={mainImage || 'https://via.placeholder.com/800'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded flex-shrink-0 overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:opacity-100 ${
                                            mainImage === img 
                                                ? 'border-primary shadow-sm scale-105' 
                                                : 'border-gray-200 opacity-60'
                                        }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── RIGHT: PRODUCT INFO ─── */}
                    <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col gap-6">
                        
                        {/* Product Details Card */}
                        <div className="bg-white py-2">
                            
                            {/* Category & Badges */}
                            <div className="flex items-center flex-wrap gap-2 mb-4">
                                <span className="text-accent font-bold uppercase tracking-[0.1em] text-xs px-1">{product.category}</span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-gray-900 mb-4 leading-snug tracking-tight">{product.name}</h1>
                            
                            {/* Ratings & Stock */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                    {renderStars(product.average_rating || 0)}
                                    <span className="text-amber-800 font-black text-xs">{(product.average_rating || 0).toFixed(1)}</span>
                                </div>
                                <span className="text-gray-400 font-semibold text-xs transition-colors cursor-pointer underline decoration-dashed underline-offset-4">{reviews.length || 0} Reviews</span>
                                {product.quantity > 0 ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${product.quantity < 5 ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${product.quantity < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                        </span>
                                        <span className={`${product.quantity < 5 ? 'text-amber-600' : 'text-emerald-600'} font-bold text-xs`}>
                                            {product.quantity < 5 ? `Only ${product.quantity} left in stock` : `In Stock (${product.quantity})`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        <span className="text-rose-600 font-bold text-xs uppercase tracking-wider">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* ─── PRICING SECTION ─── */}
                            <div className="mb-6">
                                <div className="flex items-end gap-3 flex-wrap">
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
                                        Rs. {Number(product.price).toLocaleString()}
                                    </span>
                                    {product.compare_price && (
                                        <span className="text-lg text-gray-400 line-through font-semibold pb-0.5">
                                            Rs. {Number(product.compare_price).toLocaleString()}
                                        </span>
                                    )}
                                    {discountPct > 0 && (
                                        <span className="bg-accent text-white text-[10px] font-black px-2.5 py-1 rounded-lg ml-auto shadow-sm shadow-accent/20">
                                            -{discountPct}% OFF
                                        </span>
                                    )}
                                </div>
                                {discountPct > 0 && (
                                    <p className="text-gray-900 text-sm font-bold mt-2 flex items-center gap-1.5">
                                        🎉 You save Rs. {(product.compare_price - product.price).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-500 text-sm leading-relaxed mb-7 line-clamp-3">
                                {product.description?.split('\n')[0] || "Premium sports equipment designed for peak performance."}
                            </p>

                            {/* ─── QUANTITY & ADD TO CART ─── */}
                            <div className="space-y-4 mb-7">
                                <div className="flex items-center gap-4">
                                    {/* Quantity selector */}
                                    <div className={`flex items-center border-b border-gray-200 overflow-hidden ${product.quantity <= 0 ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={product.quantity <= 0}
                                            className="w-12 h-12 flex items-center justify-center transition-all text-lg font-bold text-gray-500 disabled:cursor-not-allowed"
                                        >−</button>
                                        <span className="w-12 text-center font-black text-base text-gray-900 select-none">{product.quantity <= 0 ? 0 : quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                            disabled={product.quantity <= 0 || quantity >= product.quantity}
                                            className="w-12 h-12 flex items-center justify-center transition-all text-lg font-bold text-gray-500 disabled:text-gray-200 disabled:cursor-not-allowed"
                                        >+</button>
                                    </div>

                                    {/* Add to Cart */}
                                    <Button 
                                        variant="primary"
                                        onClick={() => handleAction('cart')}
                                        disabled={product.quantity <= 0}
                                        className={`flex-grow h-12 shadow-sm gap-2.5 transition-all ${addedToCart ? '!bg-green-500' : ''} ${product.quantity <= 0 ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {product.quantity <= 0 ? (
                                            "Sold Out"
                                        ) : addedToCart ? (
                                            <><FaCheckCircle /> Added!</>
                                        ) : (
                                            <><FaShoppingCart /> Add to Cart</>
                                        )}
                                    </Button>
                                </div>

                                {/* Buy Now */}
                                <Button 
                                    variant="primary"
                                    onClick={handleBuyNow}
                                    disabled={product.quantity <= 0}
                                    className={`w-full h-11 gap-2 shadow-sm transition-all flex items-center justify-center font-bold ${product.quantity <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                >
                                    <FaBolt />
                                    {product.quantity <= 0 ? "Unavailable" : "Buy It Now"}
                                </Button>
                            </div>


                        </div>

                        {/* ─── VENDOR CARD ─── */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent font-black text-xl border border-accent/10">
                                        {product.vendor_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <h4 className="text-base font-black text-gray-900">{product.vendor_name}</h4>
                                            <FaCheckCircle className="text-blue-500 text-xs" title="Verified Vendor" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-amber-500 text-[9px] gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    star <= Math.round(product.vendor_rating || 0) ? <FaStar key={star} /> : <FaRegStar key={star} className="text-gray-300" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                {product.vendor_rating >= 4.5 ? 'Top Rated' : product.vendor_rating >= 3.0 ? 'Trusted Vendor' : 'Verified Vendor'}
                                                {product.vendor_review_count > 0 && ` • ${product.vendor_review_count} Reviews`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleStartChat}
                                        className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                                    >
                                        <MessageSquare size={14} /> Chat
                                    </button>
                                    <Link to={`/vendor/${product.vendor_id || ''}`} className="bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 no-underline hover:bg-gray-100 hover:border-gray-300">
                                        <FaStore /> Visit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════ INFORMATION TABS ═══════════ */}
                <div id="product-tabs" className="mt-16 sm:mt-20">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10 overflow-x-auto scrollbar-hide pb-1">
                        {[
                            { id: 'description', label: 'Description', icon: <FaInfoCircle /> },
                            { id: 'specifications', label: 'Specifications', icon: <FaGem /> },
                            { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
                            { id: 'shipping', label: 'Shipping', icon: <FaSyncAlt /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap shadow-sm ${
                                    activeTab === tab.id 
                                        ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-[1.05]' 
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-accent/30 hover:text-accent hover:bg-accent/5'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-60'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <div className="animate-fade-up bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent text-sm"><FaBoxOpen /></span>
                                    Product Details
                                </h3>
                                <div className="prose prose-lg max-w-none text-gray-600 leading-loose">
                                    {product.description?.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    )) || <p>No detailed description available.</p>}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'specifications' && (
                            <div className="animate-fade-up bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-sm"><FaGem /></span>
                                    Technical Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
                                    {[
                                        { label: 'Category', value: product.category },
                                        { label: 'Vendor', value: product.vendor_name },
                                        { label: 'Authenticity', value: '100% Genuine' },
                                        { label: 'Warranty', value: '6 Months' },
                                        { label: 'Condition', value: 'Brand New' },
                                        { label: 'SKU', value: `GN-${product.id}00${product.id}` }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-400 font-semibold text-sm">{spec.label}</span>
                                            <span className="text-gray-900 font-bold text-sm">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="animate-fade-up space-y-8">
                                {/* Aggregate Section */}
                                <div className="flex flex-col md:flex-row items-center gap-10 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
                                    <div className="text-center px-6">
                                        <div className="text-6xl font-black text-gray-900 mb-2">{product.average_rating?.toFixed(1) || '0.0'}</div>
                                        {renderStars(product.average_rating || 0)}
                                        <div className="text-gray-400 font-bold text-xs mt-3 uppercase tracking-widest">{reviews.length} Reviews</div>
                                    </div>
                                    
                                    <div className="flex-grow space-y-3 w-full">
                                        {[5, 4, 3, 2, 1].map(num => {
                                            const count = reviews.filter(r => r.rating === num).length;
                                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={num} className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-gray-400 w-4">{num}</span>
                                                    <FaStar className="text-amber-400 text-xs" />
                                                    <div className="flex-grow h-2.5 bg-gray-100 rounded overflow-hidden">
                                                        <div className="h-full bg-accent rounded transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 w-8 text-right">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="space-y-4">
                                    {reviews.length > 0 ? (
                                        reviews.map((review, i) => (
                                            <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1.5">
                                                            <div className="w-9 h-9 bg-accent/5 rounded-lg flex items-center justify-center text-accent font-bold text-xs border border-accent/10">
                                                                {review.customer_name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-gray-900 text-sm">{review.customer_name}</span>
                                                                <span className="ml-2 bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex-inline items-center gap-0.5 uppercase tracking-wider">
                                                                    <FaCheckCircle className="text-[7px] inline mr-0.5" />Verified
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed text-sm">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                                            <div className="text-gray-200 text-5xl mb-4">⭐</div>
                                            <h4 className="text-lg font-black text-gray-400 mb-1">No Reviews Yet</h4>
                                            <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Review Form */}
                                <div className="bg-gradient-to-br from-accent to-accent-dark text-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-accent/20 relative overflow-hidden mt-8 border border-accent/20">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                        <FaStar size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-black mb-1">Write a Review</h3>
                                        <p className="text-gray-400 mb-8 text-sm">Your feedback helps the community choose the best gear.</p>

                                        <form onSubmit={(e) => { e.preventDefault(); if (canReview) handleReviewSubmit(e); }} className="space-y-5">
                                            <div>
                                                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Your Rating</label>
                                                {renderStars(0, isAuthenticated && canReview)}
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Your Review</label>
                                                <textarea 
                                                    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all min-h-[120px] ${(!isAuthenticated || !canReview) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    placeholder="Tell us about the performance, durability, and fit..."
                                                    value={userReview.comment}
                                                    onChange={(e) => isAuthenticated && canReview && setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                                                    disabled={!isAuthenticated || !canReview}
                                                ></textarea>
                                            </div>
                                            
                                            {!isAuthenticated ? (
                                                <Link to="/login" className="block w-full text-center py-4 bg-white/10 text-white font-black uppercase tracking-wider rounded-lg hover:bg-white/20 transition-all no-underline">
                                                    Login to Leave a Review
                                                </Link>
                                            ) : (
                                                <Button 
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={!canReview || isSubmittingReview}
                                                    className="w-full h-14 uppercase tracking-wider disabled:opacity-50"
                                                    title={!canReview ? (hasPurchased ? "You can review this product after delivery" : "Only verified purchasers can leave a review") : ""}
                                                >
                                                    {!canReview 
                                                        ? (hasPurchased ? "Review After Delivery" : "Not Eligible to Review") 
                                                        : (isSubmittingReview ? 'Submitting...' : 'Submit Review')}
                                                </Button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="animate-fade-up grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm transition-shadow">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                        <FaTruck className="text-lg" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 mb-2">Delivery</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        <strong className="text-gray-700">Kathmandu Valley:</strong> Same/Next day<br />
                                        <strong className="text-gray-700">Outside Valley:</strong> 3-5 business days
                                    </p>
                                </div>
                                <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm transition-shadow">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                                        <FaSyncAlt className="text-lg" />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 mb-2">Returns</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        <strong className="text-gray-700">7-day hassle-free</strong> return policy. No questions asked if the seal is intact.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════ SIMILAR PRODUCTS ═══════════ */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 w-full">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <p className="text-accent font-bold uppercase tracking-widest text-xs mb-2">You May Also Like</p>
                        <h2 className="text-3xl font-black text-gray-900">Similar Products</h2>
                    </div>
                    <Link to={`/products?category=${product.category_slug}`} className="text-primary font-bold text-sm border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">
                        View All
                    </Link>
                </div>

                {loadingSimilar ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : similarProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                        {similarProducts.slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400 font-medium">
                        No similar products found in this category.
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
