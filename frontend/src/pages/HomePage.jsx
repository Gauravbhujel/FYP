import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories } from "../data/products";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaShieldAlt,
  FaShippingFast,
  FaArrowRight,
  FaFire,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { CategoryCard } from "../components/CategoryCard";

/* ─── Hero slides data ─────────────────────────────────────────────── */
const heroSlides = [
  {
    title: "Gear Up for Greatness",
    subtitle:
      "Shop premium sports equipment from trusted vendors. Quality gear for every athlete to perform at their best.",
    cta: "Shop Now",
    badge: "🏆 Nepal's #1 Sports Store",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    gradient: "from-[#0a3622]/95 via-[#0f5132]/85 to-[#166534]/70",
  },
  {
    title: "Run Faster. Jump Higher.",
    subtitle:
      "Discover top-rated running shoes, basketball gear, and more. Elevate your game today.",
    cta: "Explore Gear",
    badge: "⚡ New Arrivals",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    gradient: "from-[#1e1b4b]/95 via-[#312e81]/80 to-[#4338ca]/60",
  },
  {
    title: "Train Like a Champion",
    subtitle:
      "Equipment built for champions — from gym warriors to field athletes. Find your perfect gear.",
    cta: "View Products",
    badge: "🔥 Hot Deals",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    gradient: "from-[#431407]/95 via-[#7c2d12]/80 to-[#c2410c]/60",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimer = useRef(null);

  /* Auto-advance hero slider */
  const startTimer = () => {
    clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(slideTimer.current);
  }, []);

  const goToSlide = (idx) => {
    setSlideIndex(idx);
    startTimer();
  };
  const prevSlide = () => goToSlide((slideIndex - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => goToSlide((slideIndex + 1) % heroSlides.length);

  const slide = heroSlides[slideIndex];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />

      {/* ─── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: 540 }}>
        {/* Slides */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === slideIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div
            key={`badge-${slideIndex}`}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-6 text-white text-sm font-semibold animate-fade-up"
          >
            <span>{slide.badge}</span>
          </div>

          {/* Heading */}
          <h1
            key={`title-${slideIndex}`}
            className="text-white font-black mb-5 leading-[1.1] animate-fade-up animate-fade-up-delay-1"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${slideIndex}`}
            className="text-white/85 mb-8 max-w-xl mx-auto font-normal leading-relaxed animate-fade-up animate-fade-up-delay-2"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)" }}
          >
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            key={`cta-${slideIndex}`}
            className="flex items-center gap-4 flex-wrap justify-center animate-fade-up animate-fade-up-delay-3"
          >
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-[#ff6b00] to-[#ff9d3d] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:from-[#cc5200] hover:to-[#ff6b00] hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-px flex items-center gap-2 text-base pulse-glow"
            >
              {slide.cta} <FaArrowRight className="text-sm" />
            </button>
            <button
              onClick={() => navigate("/categories")}
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:bg-white/25 hover:-translate-y-px text-base"
            >
              Browse Categories
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex items-center gap-6 text-white/70 text-xs font-medium animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <span className="flex items-center gap-1.5">✅ Verified Vendors</span>
            <span className="w-px h-4 bg-white/30" />
            <span className="flex items-center gap-1.5">🔒 Secure Checkout</span>
            <span className="w-px h-4 bg-white/30" />
            <span className="flex items-center gap-1.5">🚀 Fast Delivery</span>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-200"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-200"
        >
          <FaChevronRight className="text-sm" />
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 rounded-full ${i === slideIndex
                ? "w-8 h-2.5 bg-[#ff6b00]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" className="w-full" style={{ display: "block" }}>
            <path d="M0,60 C360,0 1080,120 1440,60 L1440,80 L0,80 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ─── BENEFITS STRIP ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 -mt-2 pb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: <FaTrophy className="text-2xl" />,
              title: "Premium Quality",
              desc: "Curated selection from verified vendors",
              color: "from-amber-500 to-yellow-400",
            },
            {
              icon: <FaShieldAlt className="text-2xl" />,
              title: "Secure Shopping",
              desc: "Protected payments and buyer guarantee",
              color: "from-[#0f5132] to-[#198754]",
            },
            {
              icon: <FaShippingFast className="text-2xl" />,
              title: "Fast Shipping",
              desc: "Quick delivery from vendors near you",
              color: "from-blue-600 to-blue-400",
            },
          ].map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${color} text-white w-14 h-14 flex items-center justify-center rounded-xl shadow-md flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-0.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ─── DEALS BANNER ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff6b00] via-[#ff8c38] to-[#ffb347] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/25">
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
              <FaFire className="text-white text-sm" />
              <span className="text-white font-bold text-xs uppercase tracking-wider">Limited Time Deals</span>
            </div>
            <h3 className="text-white font-black text-3xl md:text-4xl leading-tight mb-2">
              Up to 30% Off
            </h3>
            <p className="text-white/85 font-medium text-base">
              Massive savings on premium sports equipment. Don't miss out!
            </p>
          </div>

          <button
            onClick={() => navigate("/deals")}
            className="bg-white text-[#ff6b00] font-black px-8 py-3 rounded-full hover:shadow-xl hover:shadow-orange-900/20 hover:-translate-y-px transition-all duration-200 text-base"
          >
            Grab the Deal →
          </button>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[#ff6b00] font-semibold text-sm uppercase tracking-widest mb-1">
              Find your sport
            </p>
            <h2 className="section-heading text-3xl font-extrabold text-gray-900">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="flex items-center gap-2 text-[#0f5132] font-semibold text-sm hover:gap-3 transition-all duration-200 group"
          >
            All Categories
            <span className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <FaArrowRight className="text-xs" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
