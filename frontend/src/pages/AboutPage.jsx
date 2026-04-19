import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    FaAward, 
    FaUsers, 
    FaRocket, 
    FaCheckCircle, 
    FaHeart, 
    FaShieldAlt,
    FaArrowRight,
    FaStore
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const AboutPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFBFC] font-sans">
            <Navbar />
            
            <main className="flex-grow">
                {/* ─── HERO SECTION ─── */}
                <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/assets/about_hero.png" 
                            alt="GearUp Nepal Hero" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40"></div>
                    </div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-white text-center md:text-left">
                        <div className="max-w-2xl animate-fade-up">
                            <span className="bg-accent text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 inline-block">Established 2024</span>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
                                Fueling the <span className="text-accent">Athlete</span> Within.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed mb-8 max-w-xl opacity-90">
                                Nepal's premier multi-vendor destination for authentic sports gear, performance-wear, and tactical equipment.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">

                                <Button variant="primary" onClick={() => window.location.href = '/vendor/signup'} className="px-10 py-4 bg-accent text-white hover:bg-accent-dark border-none shadow-xl shadow-accent/20">
                                    Become a Vendor
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── VISION & MISSION ─── */}
                <section className="py-24 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-fade-in-left">
                            <div>
                                <h2 className="text-accent font-black text-xs uppercase tracking-[0.3em] mb-3">Our Core Purpose</h2>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">Democratizing Access to Premium Sports Gear.</h3>
                            </div>
                            <p className="text-gray-500 text-lg leading-loose">
                                At GearUp Nepal, we believe every athlete deserves equipment that matches their ambition. We bridges the gap between verified local vendors and dedicated enthusiasts, ensuring that quality and authenticity are never compromised.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4">
                                        <FaRocket size={20} />
                                    </div>
                                    <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-wider">Our Mission</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed font-medium">To empower the Nepalese sports community by providing a trusted marketplace for high-performance gear.</p>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                                        <FaAward size={20} />
                                    </div>
                                    <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-wider">Our Vision</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed font-medium">To become Nepal's most influential athletic platform, fostering a culture of health and excellence.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group animate-fade-in-right">
                            <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-2xl group-hover:bg-accent/30 transition-all"></div>
                            <img 
                                src="/assets/about_community.png" 
                                alt="Our Community" 
                                className="relative rounded-[2.5rem] shadow-2xl w-full h-[500px] object-cover"
                            />
                        </div>
                    </div>
                </section>



                {/* ─── OUR IMPACT ─── */}
                <section className="py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left md:w-1/2">
                            <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Supporting Local Growth.</h3>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium mb-8">
                                By choosing GearUp Nepal, you're not just getting the best equipment—you're supporting local businesses across the valley and beyond. We provide small and large vendors with the digital infrastructure they need to reach dedicated athletes across the country.
                            </p>

                        </div>
                        <div className="md:w-1/3 p-8 bg-[#FAFBFC] rounded-[3rem] border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl shadow-accent/20">
                                <FaCheckCircle />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-4">Join Our Community</h4>
                            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">Whether you're a professional athlete or just starting your fitness journey, we have the gear to help you GearUp and perform.</p>
                            <Link to="/products" className="no-underline">
                                <Button variant="primary" className="w-full h-14 uppercase tracking-widest text-xs font-black">
                                    Start Exploring <FaArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default AboutPage;
