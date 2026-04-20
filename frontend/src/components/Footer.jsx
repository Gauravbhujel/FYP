import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 bg-accent rounded-lg shadow-sm">
                <span className="text-white font-black text-base leading-none">G</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-lg tracking-tight">GearUp</span>
                <span className="text-accent font-bold text-xs tracking-widest uppercase">Nepal</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Nepal's premier multi-vendor sports destination. Quality gear from verified vendors, delivered to your door.
            </p>
            {/* Contact */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: <FaMapMarkerAlt />, text: "Pokhara, Nepal" },
                { icon: <FaPhoneAlt />, text: "9829160908" },
                { icon: <FaEnvelope />, text: "gearupnepal28@gmail.com" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className="text-accent text-xs flex-shrink-0">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded">
              Quick Links
            </h4>
            <ul className="list-none flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Shop All Products' },
                { to: '/categories', label: 'Browse Categories' },
                { to: '/about', label: 'About Us' },
                { to: '/vendor/signup', label: 'Become a Vendor' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 no-underline text-sm transition-all duration-300 flex items-center gap-1.5 group hover:text-accent hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 transition-colors flex-shrink-0 group-hover:bg-accent" />
                    <span className="relative">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent rounded transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded">
              Policies
            </h4>
            <ul className="list-none flex flex-col gap-3">
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-of-service', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 no-underline text-sm transition-all duration-300 flex items-center gap-1.5 group hover:text-accent hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 transition-colors flex-shrink-0 group-hover:bg-accent" />
                    <span className="relative">
                      {label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent rounded transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Payment */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded">
              Follow Us
            </h4>
            <div className="flex gap-3 mb-8">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', color: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white' },
                { icon: <FaInstagram />, label: 'Instagram', color: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white' },
                { icon: <FaTwitter />, label: 'Twitter', color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white' },
                { icon: <FaYoutube />, label: 'YouTube', color: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white' },
              ].map(({ icon, label, color }) => (
                <button
                  key={label}
                  title={label}
                  className={`w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-gray-400 ${color} transition-all duration-200 text-sm`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <h5 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Accepted Payments
            </h5>
            <div className="flex flex-wrap gap-2">
              {['eSewa', 'Cash on Delivery'].map((method) => (
                <span
                  key={method}
                  className="bg-white/8 border border-white/10 text-gray-400 text-[11px] font-medium px-3 py-1.5 rounded-lg"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-gray-500 text-xs text-center">
            © {new Date().getFullYear()} GearUp Nepal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
