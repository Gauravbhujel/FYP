import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../api';
import { FaSearch, FaFilter } from 'react-icons/fa';

// Product listing page for customers - dynamically fetches products from backend
const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const categories = [
        { id: 'all', label: 'All Categories' },
        { id: 'running', label: 'Running' },
        { id: 'basketball', label: 'Basketball' },
        { id: 'football', label: 'Football' },
        { id: 'tennis', label: 'Tennis' },
        { id: 'swimming', label: 'Swimming' },
        { id: 'cycling', label: 'Cycling' },
    ];

    const sizes = [
        { id: 'free', label: 'Free Size' },
        { id: 's', label: 'Small (S)' },
        { id: 'm', label: 'Medium (M)' },
        { id: 'l', label: 'Large (L)' },
        { id: 'xl', label: 'Extra Large (XL)' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products to allow client-side filtering
                const response = await api.get("products/all/");
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Update URL when category changes
    useEffect(() => {
        if (selectedCategory === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', selectedCategory);
        }
        setSearchParams(searchParams);
    }, [selectedCategory, searchParams, setSearchParams]);

    // Handle Size Checkbox
    const handleSizeToggle = (sizeId) => {
        setSelectedSizes(prev => 
            prev.includes(sizeId) 
                ? prev.filter(s => s !== sizeId)
                : [...prev, sizeId]
        );
    };

    // Filter and Sort Logic
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
        }

        // Category Filter
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category_slug.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Price Filter
        if (priceRange.min !== "") {
            result = result.filter(p => p.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== "") {
            result = result.filter(p => p.price <= parseFloat(priceRange.max));
        }

        // Size Filter
        if (selectedSizes.length > 0) {
            result = result.filter(p => p.size && selectedSizes.includes(p.size.toLowerCase()));
        }

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                // Assuming they are already sorted by newest from backend, 
                // but we can sort by id desc as a proxy if date isn't available
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, priceRange, selectedSizes, sortBy]);

    const getPageTitle = () => {
        if (selectedCategory === 'all') return "Shop All Gear";
        const cat = categories.find(c => c.id === selectedCategory);
        return cat ? cat.label : "Shop";
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            
            {/* Elegant Minimal Header */}
            <div className="bg-white border-b border-slate-200 py-10 px-5 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block opacity-80">All Your Needs in One Place</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        {getPageTitle()}
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        {selectedCategory !== 'all' 
                        ? `Explore the best ${getPageTitle().toLowerCase()} gear meticulously designed for athletes of all levels.` 
                        : "Find the absolutely perfect equipment for your game from our wide selection of sports gear."}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] w-full mx-auto my-8 px-5 flex flex-col lg:flex-row gap-8 flex-1">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm">
                    <span className="font-semibold text-slate-800">Filters</span>
                    <button 
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition"
                    >
                        <FaFilter /> {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Sidebar Filters */}
                <aside className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        
                        {/* Search */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-sm">Search</h3>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-sm">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                                            selectedCategory === cat.id 
                                            ? 'bg-primary/10 text-primary font-semibold' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-sm">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rs.</span>
                                    <input 
                                        type="number" 
                                        placeholder="Min"
                                        min="0"
                                        className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                    />
                                </div>
                                <span className="text-slate-400">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">Rs.</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max"
                                        min="0"
                                        className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-sm">Size</h3>
                            <div className="space-y-2">
                                {sizes.map(size => (
                                    <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 border-2 border-slate-300 rounded text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer peer"
                                                checked={selectedSizes.includes(size.id)}
                                                onChange={() => handleSizeToggle(size.id)}
                                            />
                                        </div>
                                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {size.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(searchQuery || selectedCategory !== 'all' || priceRange.min || priceRange.max || selectedSizes.length > 0) && (
                            <button 
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                    setPriceRange({min: "", max: ""});
                                    setSelectedSizes([]);
                                }}
                                className="w-full mt-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Product Grid Column */}
                <main className="flex-1 w-full">
                    {/* Top Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <p className="text-slate-600 font-medium">
                            Showing <span className="font-bold text-slate-900">{filteredAndSortedProducts.length}</span> results
                        </p>
                        <div className="flex items-center gap-3">
                            <label className="text-slate-500 text-sm whitespace-nowrap">Sort by:</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer font-medium"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="bg-white border border-slate-100 animate-pulse h-[380px] rounded-2xl shadow-sm">
                                    <div className="h-[200px] bg-slate-200 rounded-t-2xl"></div>
                                    <div className="p-4 space-y-4">
                                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                        <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center px-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <FaSearch className="text-3xl text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                                <p className="text-slate-500 max-w-md">
                                    We couldn't find any products matching your current filters. Try adjusting your search criteria or clearing filters.
                                </p>
                                <button 
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("all");
                                        setPriceRange({min: "", max: ""});
                                        setSelectedSizes([]);
                                    }}
                                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ProductListPage;
