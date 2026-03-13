import React from 'react';


import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-4 mt-auto">
            <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 mb-12 px-8">
                <div className="footer-section">
                    <h3 className="text-2xl mb-4 text-accent">GearUpNepal</h3>
                    <p className="text-[#aaa] leading-relaxed">Your premium destination for top-quality sports gear and apparel. Elevate your game with us.</p>
                </div>
                <div className="footer-section">
                    <h4 className="text-xl mb-5 text-[#f8f9fa]">Quick Links</h4>
                    <ul className="list-none">
                        <li className="mb-3"><Link to="/" className="text-[#aaa] no-underline transition-colors duration-300 hover:text-accent">Home</Link></li>
                        <li className="mb-3"><Link to="/products" className="text-[#aaa] no-underline transition-colors duration-300 hover:text-accent">Shop</Link></li>
                        <li className="mb-3"><Link to="/categories" className="text-[#aaa] no-underline transition-colors duration-300 hover:text-accent">Categories</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="text-xl mb-5 text-[#f8f9fa]">Customer Care</h4>
                    <ul className="list-none">
                        <li className="mb-3 text-[#aaa] hover:text-accent transition-colors duration-300 cursor-pointer">Contact Us</li>
                        <li className="mb-3 text-[#aaa] hover:text-accent transition-colors duration-300 cursor-pointer">Shipping Policy</li>
                        <li className="mb-3 text-[#aaa] hover:text-accent transition-colors duration-300 cursor-pointer">Returns & Exchanges</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="text-xl mb-5 text-[#f8f9fa]">Connect With Us</h4>
                    <div className="flex gap-4">
                        <span className="bg-[#333] px-4 py-2 rounded pointer-events-auto cursor-pointer transition-colors duration-300 hover:bg-accent">Facebook</span>
                        <span className="bg-[#333] px-4 py-2 rounded pointer-events-auto cursor-pointer transition-colors duration-300 hover:bg-accent">Instagram</span>
                        <span className="bg-[#333] px-4 py-2 rounded pointer-events-auto cursor-pointer transition-colors duration-300 hover:bg-accent">Twitter</span>
                    </div>
                </div>
            </div>
            <div className="text-center pt-8 border-t border-[#333] text-[#777] text-sm">
                <p>&copy; {new Date().getFullYear()} GearUpNepal. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
