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
    gradient: "from-black/80 to-transparent",
  },
  {
    title: "Run Faster. Jump Higher.",
    subtitle:
      "Discover top-rated running shoes, basketball gear, and more. Elevate your game today.",
    cta: "Explore Gear",
    badge: "⚡ New Arrivals",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    gradient: "from-black/80 to-transparent",
  },
  {
    title: "Train Like a Champion",
    subtitle:
      "Equipment built for champions — from gym warriors to field athletes. Find your perfect gear.",
    cta: "View Products",
    badge: "🔥 Hot Deals",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    gradient: "from-black/80 to-transparent",
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
            {/* Improved Dark Overlay for readability (~50% opacity) */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto pt-10">

          {/* Heading */}
          <h1
            key={`title-${slideIndex}`}
            className="text-white font-black mb-6 leading-[1.1] animate-fade-up animate-fade-up-delay-1 drop-shadow-sm"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${slideIndex}`}
            className="text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up animate-fade-up-delay-2 drop-shadow-sm"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.25rem)" }}
          >
            {slide.subtitle}
          </p>

          {/* CTA Buttons - Single strong action for a cleaner look */}
          <div
            key={`cta-${slideIndex}`}
            className="flex items-center gap-5 flex-wrap justify-center animate-fade-up animate-fade-up-delay-3"
          >
            <button
              onClick={() => navigate("/products")}
              className="bg-accent text-white font-semibold px-10 py-4 rounded-lg shadow-lg shadow-accent/20 transition-all duration-300 hover:bg-opacity-90 hover:scale-[1.03] active:scale-95 flex items-center gap-3 text-base"
            >
              Get Started <FaArrowRight className="text-sm" />
            </button>
          </div>


        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all duration-200"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all duration-200"
        >
          <FaChevronRight className="text-sm" />
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-500 rounded-full h-1.5 ${i === slideIndex
                ? "w-10 bg-accent"
                : "w-4 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg viewBox="0 0 1440 80" className="w-full" style={{ display: "block" }}>
            <path d="M0,60 C360,0 1080,120 1440,60 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ─── BENEFITS STRIP ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              title: "Premium Quality",
              desc: "Curated selection from verified vendors worldwide",
            },
            {
              title: "Secure Shopping",
              desc: "Encrypted payments and full buyer protection",
            },
            {
              title: "Fast Shipping",
              desc: "Doorstep delivery across all provinces of Nepal",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <div>
                <h3 className="font-black text-gray-900 text-lg mb-1 uppercase tracking-tighter">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-[240px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ─── DEALS BANNER ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 rounded-xl border-l-[6px] border-l-accent shadow-sm">
          <div className="text-center md:text-left pl-2">
            <h3 className="text-gray-900 font-black text-2xl md:text-3xl tracking-tight mb-2 uppercase">
              Up to 30% Off
            </h3>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              Massive savings on premium sports equipment. Elevate your performance for less.
            </p>
          </div>

          <button
            onClick={() => navigate("/deals")}
            className="bg-accent text-white font-bold px-10 py-4 rounded-lg border-none shadow-lg shadow-accent/20 hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm md:text-base uppercase tracking-wider"
          >
            Grab the Deal
          </button>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-1">
              Find your sport
            </p>
            <h2 className="text-3xl font-extrabold text-primary">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigate("/categories")}
            className="flex items-center gap-2 text-primary font-semibold text-sm border-b border-primary pb-0.5 hover:gap-3 transition-all duration-200 group"
          >
            All Categories <FaArrowRight className="text-xs" />
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
