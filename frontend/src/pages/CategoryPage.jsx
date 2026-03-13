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
        if (count === undefined || count === 0) return "No products yet";
        return `${count} ${count === 1 ? "product" : "products"}`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="bg-primary text-white py-[60px] px-5 text-center">
                <h1 className="text-[2.5rem] mb-2.5 font-bold">Shop by Category</h1>
                <p>Explore our premium collection of sports equipment</p>
            </div>

            <div className="max-w-[1200px] w-full mx-auto my-10 px-5">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px]">
                    {categories.map((category) => (
                        <Link
                            to={`/products?category=${category.slug}`}
                            key={category.id}
                            className="h-[300px] rounded-xl overflow-hidden relative block shadow-md group"
                        >
                            <div className="h-full w-full relative">
                                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/30 transition-colors duration-300 ease-in-out group-hover:bg-black/40"></div>
                                <div className="absolute bottom-[30px] left-[30px] text-white z-[2]">
                                    <h3 className="text-[1.8rem] mb-[5px] drop-shadow-md font-bold">{category.name}</h3>
                                    <span className="text-base opacity-90">{getCount(category.slug)}</span>
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
