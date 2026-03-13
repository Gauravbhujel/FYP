import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    // Unread counts for the badges
    const [unreadCartCount, setUnreadCartCount] = useState(() => {
        return parseInt(localStorage.getItem('unreadCartCount') || '0');
    });
    const [unreadWishlistCount, setUnreadWishlistCount] = useState(() => {
        return parseInt(localStorage.getItem('unreadWishlistCount') || '0');
    });

    // Persist counts to localStorage
    useEffect(() => {
        localStorage.setItem('unreadCartCount', unreadCartCount);
    }, [unreadCartCount]);

    useEffect(() => {
        localStorage.setItem('unreadWishlistCount', unreadWishlistCount);
    }, [unreadWishlistCount]);

    const incrementCart = (amount = 1) => {
        setUnreadCartCount(prev => prev + amount);
    };

    const incrementWishlist = (amount = 1) => {
        setUnreadWishlistCount(prev => prev + amount);
    };

    const resetCart = () => {
        setUnreadCartCount(0);
    };

    const resetWishlist = () => {
        setUnreadWishlistCount(0);
    };

    return (
        <CartContext.Provider value={{
            unreadCartCount,
            unreadWishlistCount,
            incrementCart,
            incrementWishlist,
            resetCart,
            resetWishlist
        }}>
            {children}
        </CartContext.Provider>
    );
};
