import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../api';
import { 
    FaSearch, 
    FaFilter, 
    FaChevronDown, 
    FaChevronUp, 
    FaSortAmountDown, 
    FaArrowRight,
    FaTimes,
    FaRegSadTear,
    FaSlidersH
} from 'react-icons/fa';

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
    
    // UI States
    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        size: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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

    useEffect(() => {
        if (selectedCategory === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', selectedCategory);
        }
        setSearchParams(searchParams);
    }, [selectedCategory, searchParams, setSearchParams]);

    const handleSizeToggle = (sizeId) => {
        setSelectedSizes(prev => 
            prev.includes(sizeId) 
                ? prev.filter(s => s !== sizeId)
                : [...prev, sizeId]
        );
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
        }
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category_slug.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (priceRange.min !== "") {
            result = result.filter(p => p.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== "") {
            result = result.filter(p => p.price <= parseFloat(priceRange.max));
        }
        if (selectedSizes.length > 0) {
            result = result.filter(p => p.size && selectedSizes.includes(p.size.toLowerCase()));
        }
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'newest': default: result.sort((a, b) => b.id - a.id); break;
        }
        return result;
    }, [products, searchQuery, selectedCategory, priceRange, selectedSizes, sortBy]);

    const getPageTitle = () => {
        if (selectedCategory === 'all') return "All Products";
        const cat = categories.find(c => c.id === selectedCategory);
        return cat ? cat.label : "Products";
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setPriceRange({min: "", max: ""});
        setSelectedSizes([]);
        setIsMobileFiltersOpen(false);
    };

    const activeFiltersCount = (searchQuery ? 1 : 0) + 
                             (selectedCategory !== 'all' ? 1 : 0) + 
                             (priceRange.min || priceRange.max ? 1 : 0) + 
                             (selectedSizes.length > 0 ? 1 : 0);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar />
            
            <div className="bg-white py-12 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                        <Link to="/" className="transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900">Products</span>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 uppercase">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-500 max-w-2xl font-medium">
                                Showing {filteredAndSortedProducts.length} results
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-10 flex flex-col lg:flex-row gap-10 flex-grow">
                
                {/* Mobile Filter Sticky Button */}
                <div className="lg:hidden sticky top-[72px] z-30 mb-4">
                    <button 
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="w-full flex justify-between items-center bg-white border border-gray-200 p-4 rounded-2xl shadow-lg ring-1 ring-black/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-100 text-primary w-10 h-10 rounded flex items-center justify-center shadow-sm">
                                <FaFilter size={14} />
                            </span>
                            <span className="font-black text-gray-900 text-sm uppercase tracking-wider">Filters & Refine</span>
                        </div>
                        {activeFiltersCount > 0 && (
                            <span className="bg-accent text-white text-[10px] font-black px-2 py-1 rounded-md">{activeFiltersCount}</span>
                        )}
                    </button>
                </div>

                {/* ─── SIDEBAR FILTERS ─── */}
                <aside className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:w-64 flex-shrink-0 transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
                    {/* Backdrop for mobile */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-[90vh] lg:h-auto lg:relative lg:bottom-auto bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible flex flex-col p-8 lg:p-0">
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center mb-8 lg:hidden">
                            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-primary pl-4">FILTERS</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><FaTimes /></button>
                        </div>

                        <div className="lg:sticky lg:top-32 space-y-10">
                            {/* Global Search inside Sidebar */}
                            <div className="mb-10 pb-8 border-b-2 border-primary/5">
                                <h3 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2.5">
                                    <div className="w-6 h-6 bg-accent text-white rounded shadow-sm shadow-accent/20 flex items-center justify-center">
                                        <FaSearch size={8} />
                                    </div>
                                    Discovery Search
                                </h3>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        placeholder="Keywords..." 
                                        className="w-full py-4 px-4 bg-gray-50/30 border border-gray-100/50 focus:border-accent/20 rounded-xl transition-all text-xs font-black placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-accent/5 shadow-sm shadow-black/5"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <FaSearch size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-all duration-300" />
                                </div>
                            </div>
                                        {/* Section: Categories */}
                             <div className="mb-8 font-sans">
                                <button 
                                    onClick={() => toggleSection('categories')}
                                    className="w-full flex justify-between items-center font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-6 group"
                                >
                                    <span className="group-hover:text-accent transition-colors">By Discipline</span>
                                    {openSections.categories ? <FaChevronUp size={10} className="text-accent" /> : <FaChevronDown size={10} className="text-gray-300" />}
                                </button>
                                {openSections.categories && (
                                    <div className="space-y-3 animate-fade-in pl-1">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full text-left py-3 px-4 transition-all flex items-center justify-between text-[11px] font-black uppercase tracking-widest rounded-xl ${
                                                    selectedCategory === cat.id 
                                                    ? 'text-accent border-2 border-accent bg-accent/5' 
                                                    : 'text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200'
                                                }`}
                                            >
                                                {cat.label}
                                                {selectedCategory === cat.id && <FaArrowRight size={10} className="ml-2" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section: Price Range Slider */}
                            <div className="mb-8">
                                <button 
                                    onClick={() => toggleSection('price')}
                                    className="w-full flex justify-between items-center font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-4 group"
                                >
                                    <span className="group-hover:text-accent transition-colors">Price Range</span>
                                    {openSections.price ? <FaChevronUp size={10} className="text-accent" /> : <FaChevronDown size={10} className="text-gray-300" />}
                                </button>
                                {openSections.price && (
                                    <div className="space-y-6 animate-fade-in px-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded">Rs. {priceRange.min || 0}</span>
                                            <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded">Rs. {priceRange.max || 10000}</span>
                                        </div>
                                        
                                        <div className="range-slider-container">
                                            <div className="range-slider-track"></div>
                                            <div 
                                                className="range-slider-active-track"
                                                style={{
                                                    left: `${(Math.min(priceRange.min || 0, priceRange.max || 10000) / 10000) * 100}%`,
                                                    right: `${100 - (Math.max(priceRange.min || 0, priceRange.max || 10000) / 10000) * 100}%`
                                                }}
                                            ></div>
                                            <input 
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={priceRange.min || 0}
                                                onChange={(e) => {
                                                    const value = Math.min(Number(e.target.value), (priceRange.max || 10000) - 100);
                                                    setPriceRange({ ...priceRange, min: value });
                                                }}
                                                className="range-slider-input"
                                            />
                                            <input 
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={priceRange.max || 10000}
                                                onChange={(e) => {
                                                    const value = Math.max(Number(e.target.value), (priceRange.min || 0) + 100);
                                                    setPriceRange({ ...priceRange, max: value });
                                                }}
                                                className="range-slider-input"
                                            />
                                        </div>
                                        
                                    </div>
                                )}
                            </div>

                            {/* Section: Sizes */}
                            <div className="mb-8">
                                <button 
                                    onClick={() => toggleSection('size')}
                                    className="w-full flex justify-between items-center font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-4 group"
                                >
                                    <span className="group-hover:text-accent transition-colors">Sizing Options</span>
                                    {openSections.size ? <FaChevronUp size={10} className="text-accent" /> : <FaChevronDown size={10} className="text-gray-300" />}
                                </button>
                                {openSections.size && (
                                    <div className="flex flex-wrap gap-2 animate-fade-in">
                                        {sizes.map(size => (
                                            <button 
                                                key={size.id}
                                                onClick={() => handleSizeToggle(size.id)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                                                    selectedSizes.includes(size.id)
                                                    ? 'bg-accent text-white border-accent shadow-sm'
                                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                                }`}
                                            >
                                                {size.id}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile CTA */}
                            <button 
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full lg:hidden bg-accent text-white py-4 rounded font-black text-sm shadow-sm mt-6 transition-all"
                            >
                                SHOW {filteredAndSortedProducts.length} RESULTS
                            </button>

                            {activeFiltersCount > 0 && (
                                <button 
                                    onClick={clearFilters}
                                    className="w-full py-3 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 group"
                                >
                                    <FaTimes className="transition-transform" /> Reset Discovery
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ─── PRODUCT DISCOVERY GRID ─── */}
                <main className="flex-1 w-full">
                    {/* Top Bar / Sort Utility */}
                    <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                Showing <span className="text-gray-900">{filteredAndSortedProducts.length}</span> Results
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-gray-900 py-2 pl-2 pr-8 rounded-none focus:outline-none focus:ring-0 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Infinite Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse flex flex-col">
                                    <div className="aspect-[3/4] bg-gray-200 rounded-[2.5rem] mb-4 shadow-inner"></div>
                                    <div className="space-y-3 px-2">
                                        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 bg-[#FDFFF5]/50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6 animate-fade-up">
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                                    <FaRegSadTear className="text-4xl text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">No Gear Detected</h3>
                                <p className="text-gray-400 max-w-sm mb-10 font-medium italic">
                                    "Our scouts couldn't find matches for this specific search. Adjust your filters to continue the journey."
                                </p>
                                <button 
                                    onClick={clearFilters}
                                    className="px-10 py-4 bg-accent text-white rounded transition-all font-black text-xs uppercase tracking-widest shadow-sm flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all duration-300"
                                >
                                    <FaSlidersH /> Reset Discovery
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination Placeholder */}
                    {filteredAndSortedProducts.length > 8 && (
                        <div className="flex justify-center mt-20">
                            <button className=" group flex items-center gap-4 px-8 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm">
                                <span className="text-gray-400 transition-colors">Mounting more results</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                </div>
                            </button>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ProductListPage;
