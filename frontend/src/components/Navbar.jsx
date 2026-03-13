import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { unreadCartCount, unreadWishlistCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      const response = await fetch(`http://127.0.0.1:8000/api/products/search/?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowSearchResults(true);
      }
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearchResultClick = (productId) => {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-[1000]">
      <div className="navbar-logo">
        <Link
          to="/"
          className="text-2xl font-bold text-primary no-underline flex items-center gap-2"
        >
          <span className="bg-primary text-white px-2 py-0.5 rounded font-extrabold text-base">
            G
          </span>{" "}
          GearUpNepal
        </Link>
      </div>

      <ul className="flex list-none gap-8 m-0 p-0">
        <li>
          <Link
            to="/"
            className="no-underline text-[#333] font-medium transition-colors duration-300 hover:text-primary"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className="no-underline text-[#333] font-medium transition-colors duration-300 hover:text-primary"
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/categories"
            className="no-underline text-[#333] font-medium transition-colors duration-300 hover:text-primary"
          >
            Categories
          </Link>
        </li>
      </ul>

      <div className="relative" ref={searchRef}>
        <div className="flex items-center bg-[#f5f5f5] px-4 py-2 rounded w-[350px] border border-[#ddd] focus-within:border-primary focus-within:bg-white transition-all">
          <FaSearch className={isSearching ? "text-primary animate-pulse" : "text-[#888]"} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
            className="border-none bg-transparent outline-none w-full ml-2 text-[#333] text-sm"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#eee] shadow-xl rounded-lg overflow-hidden z-[2000] max-h-[400px] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                    <div className="text-sm font-bold text-primary">Rs. {product.price}</div>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 text-center">
                  <Link 
                    to={`/products?search=${searchQuery}`} 
                    className="text-xs font-bold text-primary hover:underline"
                    onClick={() => setShowSearchResults(false)}
                  >
                    View all results
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

      <div className="flex items-center gap-6">
        <Link
          to="/wishlist"
          className="relative inline-flex items-center text-[#333] text-xl transition-colors duration-300 hover:text-primary"
        >
          <FaHeart />
          {unreadWishlistCount > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-[#dc3545] text-white text-[0.7rem] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
              {unreadWishlistCount}
            </span>
          )}
        </Link>
        <Link
          to="/cart"
          className="relative inline-flex items-center text-[#333] text-xl transition-colors duration-300 hover:text-primary"
        >
          <FaShoppingCart />
          {unreadCartCount > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-[#dc3545] text-white text-[0.7rem] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCartCount}
            </span>
          )}
        </Link>
        {isLoggedIn ? (
          <div className="relative">
            <div
              className="text-[#333] text-xl flex items-center transition-colors duration-300 hover:text-primary cursor-pointer"
              onClick={toggleDropdown}
            >
              <FaUser />
            </div>
            {showDropdown && (
              <div className="absolute top-full right-0 w-[180px] bg-white shadow-md rounded py-2 z-[1001] flex flex-col border border-[#eee]">
                <Link
                  to="/vendor/signup"
                  className="px-4 py-3 no-underline text-[#333] text-sm transition-colors duration-200 text-left bg-transparent border-none cursor-pointer block w-full hover:bg-bg-light hover:text-primary"
                  onClick={() => setShowDropdown(false)}
                >
                  Become Vendor
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-3 no-underline text-[#333] text-sm transition-colors duration-200 text-left bg-transparent border-t border-[#eee] cursor-pointer block w-full hover:bg-bg-light hover:text-primary"
                  onClick={() => setShowDropdown(false)}
                >
                  View Full Profile
                </Link>
                <button
                  className="px-4 py-3 no-underline text-[#dc3545] text-sm transition-colors duration-200 text-left bg-transparent border-t border-[#eee] cursor-pointer block w-full hover:bg-[#ffebee] hover:text-[#a71d2a]"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-white px-4 py-2 rounded no-underline font-bold text-sm transition-colors duration-300 hover:bg-secondary"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
