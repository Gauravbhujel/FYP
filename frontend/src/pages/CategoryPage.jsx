import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { categories } from "../data/products";
import { CategoryCard } from "../components/CategoryCard";

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
            
            <div className="pt-20 pb-10 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tighter uppercase mb-6">
                    Shop by Category
                </h1>
                <p className="text-gray-500 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                    Discover our professional collection of high-performance gear designed for peak athletic excellence across all major provinces of Nepal.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-[1200px] w-full mx-auto my-12 px-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <CategoryCard 
                            key={category.id} 
                            {...category} 
                            productCount={getCount(category.slug)} 
                        />
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default CategoryPage;
