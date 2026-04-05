import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaTimes,
  FaBars,
  FaRegCommentDots,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useChatNotifications } from "../hooks/useChatNotifications";
import api from "../api";

const Navbar = () => {
  const { unreadCartCount, unreadWishlistCount } = useCart();
  const { unreadCount } = useChatNotifications();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setIsSearching(true);
    try {
      const response = await api.get(`products/search/?q=${query}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSearchResultClick = (productId) => {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-[1000] w-full">
      {/* Announcement Bar */}
      <div className="bg-primary text-white text-xs py-2 text-center font-medium tracking-wide">
        🚚 Free delivery on orders above{" "}
        <span className="font-bold text-accent-light">Rs. 999</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;✨ Trusted by 10,000+ athletes across Nepal
      </div>

      {/* Main Navbar */}
      <nav
        className={`flex justify-between items-center px-6 md:px-10 py-3.5 transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-gray-100 shadow-sm"
            : "bg-white border-b border-gray-100 shadow-none"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline select-none"
        >
          <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shadow-sm">
            <span className="text-white font-black text-base leading-none">G</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-primary font-extrabold text-lg tracking-tight leading-tight">
              GearUp
            </span>
            <span className="text-accent font-bold text-xs tracking-widest uppercase leading-tight">
              Nepal
            </span>
          </div>
        </Link>

        {/* Nav Links – desktop */}
        <ul className="hidden md:flex list-none gap-7 m-0 p-0">
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "Products" },
            { to: "/categories", label: "Categories" },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="no-underline text-text-mid font-medium text-sm transition-all duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent rounded transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="relative hidden md:block" ref={searchRef}>
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 w-[320px] lg:w-[380px] ${
              showSearchResults || searchQuery
                 ? "border-primary bg-white shadow-sm ring-1 ring-primary/10"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <FaSearch className="text-gray-400 text-sm flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder="Search sports gear, shoes, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.length >= 2 && setShowSearchResults(true)
              }
              className="border-none bg-transparent outline-none w-full text-[#111827] text-sm placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="flex-shrink-0 text-gray-400 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[2000] max-h-[400px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Results
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSearchResultClick(product.id)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {product.category}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary flex-shrink-0">
                        Rs. {product.price}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <Link
                      to={`/products?search=${searchQuery}`}
                      className="text-xs font-bold text-primary transition-colors"
                      onClick={() => setShowSearchResults(false)}
                    >
                      View all results →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          {/* Messages */}
          {isLoggedIn && (
            <Link
              to="/chat"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-accent hover:bg-accent/10 transition-all duration-200"
              title="Messages"
            >
              <FaRegCommentDots className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-accent hover:bg-accent/10 transition-all duration-200"
            title="Wishlist"
          >
            <FaHeart className="text-lg" />
            {unreadWishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                {unreadWishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-accent hover:bg-accent/10 transition-all duration-200"
            title="Cart"
          >
            <FaShoppingCart className="text-lg" />
            {unreadCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                {unreadCartCount}
              </span>
            )}
          </Link>

          {/* Profile / Sign In */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-sm transition-all duration-200"
                title="Profile"
              >
                <FaUser className="text-sm" />
              </button>
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-[200px] bg-white shadow-md rounded-2xl py-2 z-[1001] border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Signed in</p>
                  </div>
                  <Link
                    to="/vendor/signup"
                    className="flex items-center px-4 py-3 no-underline text-text-mid text-sm transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    🏪 Become a Vendor
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 no-underline text-text-mid text-sm transition-colors border-t border-gray-50"
                    onClick={() => setShowDropdown(false)}
                  >
                    👤 View Profile
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-3 text-red-500 text-sm transition-colors border-t border-gray-100 cursor-pointer font-medium"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-accent text-white px-5 py-2.5 rounded-full no-underline font-semibold text-sm transition-all duration-200 shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl px-6 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50">
            <FaSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              className="border-none bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          {/* Mobile Links */}
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "Products" },
            { to: "/categories", label: "Categories" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="no-underline text-text-mid font-medium text-sm py-2 border-b border-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
