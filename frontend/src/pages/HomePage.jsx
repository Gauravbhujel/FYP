import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/products";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTrophy,
  FaShieldAlt,
  FaShippingFast,
  FaArrowRight,
} from "react-icons/fa";
import { CategoryCard } from "../components/CategoryCard";
const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <header
        className="text-white pt-[100px] px-5 pb-[150px] text-center flex items-center justify-center min-h-[600px] bg-cover bg-center relative md:min-h-[500px] md:pb-[80px] [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)] md:[clip-path:polygon(0_0,100%_0,100%_90%,0_100%)]"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 81, 50, 0.9) 0%, rgba(25, 135, 84, 0.8) 100%),  url("https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
        }}
      >
        <div className="max-w-[900px] w-full mx-auto z-[2]">
          <h1 className="text-[4rem] font-extrabold mb-5 leading-[1.2] capitalize text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#e0e0e0] drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] md:text-[2.8rem]">
            Gear Up for Greatness
          </h1>
          <p className="text-[1.2rem] mb-10 max-w-[700px] mx-auto text-[#f8f9fa] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Shop premium sports equipment from trusted vendors worldwide.
            Quality gear for every athlete to perform at their best.
          </p>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="flex flex-col md:flex-row justify-center gap-[30px] px-5 py-10 pb-[80px] bg-transparent flex-wrap max-w-[1200px] mx-auto -mt-[60px] relative z-[5] md:p-5">
        <div className="flex items-center gap-5 p-[30px] flex-1 min-w-[300px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 transition-transform duration-300 hover:-translate-y-[5px]">
          <div className="bg-[rgba(15,81,50,0.1)] text-primary w-[60px] h-[60px] flex items-center justify-center rounded-full text-[1.8rem] shrink-0">
            <FaTrophy />
          </div>
          <div className="benefit-text">
            <h3 className="text-[1.2rem] text-text-dark mb-[5px] font-bold">
              Premium Quality
            </h3>
            <p className="text-[0.95rem] text-[#666] leading-[1.4]">
              Curated selection from verified vendors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-[30px] flex-1 min-w-[300px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 transition-transform duration-300 hover:-translate-y-[5px]">
          <div className="bg-[rgba(15,81,50,0.1)] text-primary w-[60px] h-[60px] flex items-center justify-center rounded-full text-[1.8rem] shrink-0">
            <FaShieldAlt />
          </div>
          <div className="benefit-text">
            <h3 className="text-[1.2rem] text-text-dark mb-[5px] font-bold">
              Secure Shopping
            </h3>
            <p className="text-[0.95rem] text-[#666] leading-[1.4]">
              Protected payments and buyer guarantee
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-[30px] flex-1 min-w-[300px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 transition-transform duration-300 hover:-translate-y-[5px]">
          <div className="bg-[rgba(15,81,50,0.1)] text-primary w-[60px] h-[60px] flex items-center justify-center rounded-full text-[1.8rem] shrink-0">
            <FaShippingFast />
          </div>
          <div className="benefit-text">
            <h3 className="text-[1.2rem] text-text-dark mb-[5px] font-bold">
              Fast Shipping
            </h3>
            <p className="text-[0.95rem] text-[#666] leading-[1.4]">
              Quick delivery from vendors near you
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[2.2rem] text-text-dark font-extrabold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[60px] after:h-[4px] after:bg-accent after:rounded-[2px] md:text-[1.8rem]">
            Featured Products
          </h2>
          <button onClick={() => navigate("/products")} className="bg-none border-none text-primary font-bold text-base cursor-pointer flex items-center gap-2 transition-[gap] duration-300 hover:gap-3 hover:text-secondary">
            View All <FaArrowRight />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-slate-100 animate-pulse h-[400px] rounded-xl"></div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-500">
              No products found.
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[2.2rem] text-text-dark font-extrabold relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[60px] after:h-[4px] after:bg-accent after:rounded-[2px] md:text-[1.8rem]">
            Shop by Category
          </h2>
          <button onClick={() => navigate("/categories")} className="bg-none border-none text-primary font-bold text-base cursor-pointer flex items-center gap-2 transition-[gap] duration-300 hover:gap-3 hover:text-secondary">
            View All <FaArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
