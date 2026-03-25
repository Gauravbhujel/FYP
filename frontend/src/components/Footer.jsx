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
              <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-sm">
                <span className="text-primary font-black text-base leading-none">G</span>
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
                { icon: <FaMapMarkerAlt />, text: "Kathmandu, Nepal" },
                { icon: <FaPhoneAlt />, text: "+977-1-XXXXXXX" },
                { icon: <FaEnvelope />, text: "support@gearupnepal.com" },
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
                { to: '/vendor/signup', label: 'Become a Vendor' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 no-underline text-sm transition-all duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded">
              Customer Care
            </h4>
            <ul className="list-none flex flex-col gap-3">
              {['Contact Us', 'Track My Order', 'Shipping Policy', 'Returns & Exchanges', 'FAQs'].map(
                (item) => (
                  <li key={item}>
                    <span className="text-gray-400 text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-gray-600 transition-colors flex-shrink-0" />
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social + Payment */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent after:rounded">
              Follow Us
            </h4>
            <div className="flex gap-3 mb-8">
              {[
                { icon: <FaFacebookF />, label: 'Facebook', color: '' },
                { icon: <FaInstagram />, label: 'Instagram', color: '' },
                { icon: <FaTwitter />, label: 'Twitter', color: '' },
                { icon: <FaYoutube />, label: 'YouTube', color: '' },
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
              {['eSewa', 'Khalti', 'IME Pay', 'Cash on Delivery'].map((method) => (
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
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} GearUp Nepal. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span className="cursor-pointer transition-colors">Privacy Policy</span>
            <span className="w-px h-3 bg-gray-700" />
            <span className="cursor-pointer transition-colors">Terms of Service</span>
            <span className="w-px h-3 bg-gray-700" />
            <span className="cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
