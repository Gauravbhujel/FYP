import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories } from "../data/products";

const CategoryPage = () => {
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/categories/stats/")
            .then((res) => res.json())
            .then((data) => {
                setCategoryCounts(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const getCount = (slug) => {
        if (loading) return "Loading...";
        const count = categoryCounts[slug];
        if (count === undefined || count === 0) return "Fresh & New ✨";
        return `${count} ${count === 1 ? "Item" : "Items"} 🛍️`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfdfd]">
            <Navbar />
            
            {/* Elegant Minimal Header */}
            <div className="pt-12 pb-6 px-5 text-center max-w-3xl mx-auto">
                <span className="text-emerald-500 font-semibold tracking-wider uppercase text-sm mb-3 block">Premium Sports Gear</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
                    Shop by Category
                </h1>
                <p className="text-slate-500 text-lg">
                    Discover our thoughtfully curated collection of high-performance equipment designed to elevate your game.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 mx-auto mt-8 rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1200px] w-full mx-auto my-12 px-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            to={`/products?category=${category.slug}`}
                            key={category.id}
                            className="group block relative h-[340px] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out border-4 border-white"
                        >
                            <div className="h-full w-full relative">
                                {/* Image with soft zoom */}
                                <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                                />
                                
                                {/* Overlay Gradient - extremely soft and cute */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-800/10 to-transparent transition-opacity duration-300 group-hover:from-slate-900/70"></div>
                                
                                {/* Floating Glassmorphism Badge */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[85%] bg-white/20 backdrop-blur-md rounded-3xl p-5 text-center border border-white/50 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:bg-white/30">
                                    <h3 className="text-2xl text-white font-bold drop-shadow-md mb-2 tracking-wide font-sans">
                                        {category.name}
                                    </h3>
                                    <span className="inline-block px-4 py-1.5 bg-white text-emerald-600 font-bold rounded-full text-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
                                        {getCount(category.slug)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default CategoryPage;
