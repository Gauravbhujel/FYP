import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaHeart, FaStar, FaArrowLeft, FaCheckCircle, FaTruck, FaShieldAlt } from 'react-icons/fa';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { incrementCart, incrementWishlist } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`products/${productId}/`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

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

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-8">
                    <h2 className="text-3xl font-bold text-text-dark mb-4">Product Not Found</h2>
                    <p className="text-gray-500 mb-8">The product you are looking for might have been removed or is unavailable.</p>
                    <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-xl font-bold no-underline hover:bg-secondary transition-all">
                        Back to Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
            <Navbar />
            
            <div className="max-w-[1200px] mx-auto px-6 py-12 w-full flex-grow">
                {/* Breadcrumbs / Back Button */}
                <div className="flex items-center gap-4 mb-10">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary border-none bg-transparent cursor-pointer font-bold transition-colors"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <div className="h-4 w-[1px] bg-gray-200"></div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                        <Link to="/" className="hover:text-primary no-underline transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/products" className="hover:text-primary no-underline transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-primary">{product.category}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-24">
                            <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[#f8f9fa]">
                                <img 
                                    src={product.image || 'https://via.placeholder.com/600'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                                {product.is_new && (
                                    <span className="absolute top-6 left-6 bg-accent text-white px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider shadow-lg">New</span>
                                )}
                                {product.discount && (
                                    <span className="absolute top-6 right-6 bg-red-500 text-white px-5 py-2 rounded-full font-black text-sm uppercase tracking-wider shadow-lg">-{product.discount}%</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="mb-6">
                            <span className="text-accent font-black uppercase tracking-[0.2em] text-sm mb-3 block">{product.category}</span>
                            <h1 className="text-4xl md:text-5xl font-black text-text-dark mb-4 leading-tight">{product.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-1 text-[#ffc107]">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                                <span className="text-gray-400 font-bold text-sm">(4.8 / 128 Reviews)</span>
                                <div className="h-4 w-[1px] bg-gray-200"></div>
                                <span className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                                    <FaCheckCircle /> In Stock
                                </span>
                            </div>

                            <div className="flex items-end gap-4 mb-10">
                                <span className="text-4xl font-black text-primary">Rs. {Number(product.price).toLocaleString()}</span>
                                {product.compare_price && (
                                    <span className="text-2xl text-gray-300 line-through font-bold mb-1">Rs. {Number(product.compare_price).toLocaleString()}</span>
                                )}
                            </div>

                            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm mb-10">
                                <h3 className="text-lg font-bold text-text-dark mb-4">Description</h3>
                                <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">
                                    {product.description || "No description available for this gear."}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-5 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 p-2 rounded-2xl border border-gray-200 w-fit">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl border-none bg-transparent cursor-pointer transition-all text-xl font-bold"
                                        >-</button>
                                        <span className="w-14 text-center font-black text-xl">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl border-none bg-transparent cursor-pointer transition-all text-xl font-bold"
                                        >+</button>
                                    </div>
                                    <button 
                                        onClick={() => handleAction('cart')}
                                        className="flex-grow bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 hover:bg-secondary hover:-translate-y-1 transition-all border-none cursor-pointer flex items-center justify-center gap-3"
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleAction('wishlist')}
                                    className="w-full bg-white border-2 border-primary text-primary py-5 rounded-2xl font-black text-lg hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center gap-3"
                                >
                                    <FaHeart /> Add to Wishlist
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                                        <FaTruck />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Free Delivery</span>
                                        <span className="text-xs text-gray-400">On orders over Rs. 5000</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                                        <FaShieldAlt />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Secure Payment</span>
                                        <span className="text-xs text-gray-400">100% Secure Transaction</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor Section placeholder */}
                <div className="mt-20 pt-12 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-primary font-black text-2xl border-4 border-white shadow-lg">
                            {product.vendor_name?.charAt(0)}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sold by</span>
                            <h4 className="text-xl font-bold text-text-dark">{product.vendor_name}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
