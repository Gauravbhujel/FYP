import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../api';
import {
  FaFire,
  FaTag,
  FaSortAmountDown,
  FaRegSadTear,
  FaSlidersH,
  FaPercent,
  FaBolt
} from 'react-icons/fa';

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('biggest-discount');

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

  // Only show products that have a discount
  const dealProducts = useMemo(() => {
    let result = products.filter(p => p.discount && p.discount > 0);
    switch (sortBy) {
      case 'biggest-discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }
    return result;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFA] font-sans">
      <Navbar />

      {/* ─── DEALS HERO BANNER ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ff6b00] via-[#ff8c38] to-[#ffb347]">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Deals</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <FaFire className="text-white text-sm" />
                <span className="text-white font-bold text-xs uppercase tracking-wider">Hot Deals & Discounts</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 uppercase">
                Mega Deals
                <span className="ml-4 text-sm font-bold text-[#ff6b00] bg-white px-3 py-1 rounded-full align-middle normal-case tracking-normal shadow-lg">
                  {loading ? '...' : `${dealProducts.length} Items`}
                </span>
              </h1>
              <p className="text-white/85 max-w-xl font-medium text-sm md:text-base leading-relaxed">
                Grab incredible savings on premium sports equipment. These deals won't last forever!
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/25">
                <FaTag className="text-white" />
                <span className="text-white font-bold text-sm">Use code: <span className="text-xl font-black">GEARUP25</span></span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                <FaBolt /> <span>Limited time offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full" style={{ display: 'block' }}>
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,60 L0,60 Z" fill="#F9FBFA" />
          </svg>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-10 flex-grow">

        {/* Top Bar / Sort */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 overflow-hidden relative">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff6b00]">
              <FaPercent size={14} />
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              Showing <span className="text-gray-900">{dealProducts.length}</span> Discounted Item{dealProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full sm:w-auto">
            <span className="pl-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border-none text-gray-900 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-0 cursor-pointer font-black text-xs min-w-[180px] shadow-sm"
            >
              <option value="biggest-discount">Biggest Discount</option>
              <option value="newest">Fresh Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
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
          ) : dealProducts.length > 0 ? (
            dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-6 animate-fade-up">
              <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                <FaRegSadTear className="text-4xl text-orange-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">No Deals Right Now</h3>
              <p className="text-gray-400 max-w-sm mb-10 font-medium italic">
                "Stay tuned! Our vendors are cooking up some amazing deals for you. Check back soon."
              </p>
              <Link
                to="/products"
                className="px-10 py-4 bg-gradient-to-r from-[#ff6b00] to-[#ff9d3d] text-white rounded-2xl hover:from-[#cc5200] hover:to-[#ff6b00] transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 no-underline flex items-center gap-3"
              >
                <FaSlidersH /> Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DealsPage;
