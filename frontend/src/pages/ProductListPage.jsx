import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import api from '../api';

// Product listing page for customers - dynamically fetches products from backend
const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = category ? `products/all/?category=${category}` : "products/all/";
                const response = await api.get(url);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    const getPageTitle = () => {
        if (!category) return "Shop All Gear";
        // Capitalize first letter of category
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="bg-primary text-white py-[60px] px-5 text-center">
                <h1 className="text-[2.5rem] mb-2.5 font-bold">{getPageTitle()}</h1>
                <p>{category ? `Browse our collection of ${category} equipment.` : "Find the perfect equipment for your game."}</p>
            </div>
            <div className="max-w-[1200px] w-full mx-auto my-10 px-5">
                <main className="w-full">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px]">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="bg-slate-100 animate-pulse h-[400px] rounded-xl"></div>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-500">
                                No products found. Check back later!
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
