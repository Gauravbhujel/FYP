import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import DealProductCard from '../components/DealProductCard';
import Footer from '../components/Footer';
import api from '../api';
import {
  FaRegSadTear,
  FaPercent,
  FaArrowLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-20 w-full flex-grow">
        
        {/* Navigation / Back Button */}
        <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all mb-8 group"
        >
            <FaArrowLeft className="text-[8px] transition-transform group-hover:-translate-x-1" /> Return to Home
        </Link>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    🔥 Grab the Deal
                </h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] leading-relaxed max-w-xl">
                    High-performance gear at elite-level discounts. Valid for a limited rotational window.
                </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                <span className="pl-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Sort Inventory:</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border-none text-gray-900 py-3 px-5 rounded-xl focus:outline-none focus:ring-0 cursor-pointer font-black text-[10px] uppercase tracking-widest min-w-[200px] shadow-sm appearance-none"
                >
                    <option value="biggest-discount">Max Savings (%)</option>
                    <option value="newest">Latest Arrivals</option>
                    <option value="price-asc">Value: Low to High</option>
                    <option value="price-desc">Value: High to Low</option>
                </select>
            </div>
        </header>

        {/* Results Bar */}
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-accent">
                <FaPercent size={10} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Identified <span className="text-gray-900">{dealProducts.length}</span> Active Tactical Discount{dealProducts.length !== 1 ? 's' : ''}
            </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-square bg-gray-100 rounded-2xl shadow-inner"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : dealProducts.length > 0 ? (
            dealProducts.map((product) => (
              <DealProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-32 bg-gray-50 rounded-[2rem] border border-gray-200 border-dashed flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <FaRegSadTear className="text-3xl text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No active deals found</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-10 max-w-xs">
                Our replenishment cycles vary. Monitor this channel for the latest rotational gear.
              </p>
              <Link
                to="/products"
                className="px-8 py-4 bg-gray-900 text-white rounded-xl transition-all hover:bg-black hover:scale-[1.05] active:scale-95 font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3"
              >
                Explore Full Inventory
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DealsPage;
