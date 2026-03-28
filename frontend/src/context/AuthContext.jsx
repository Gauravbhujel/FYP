import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role");
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have a token and set initial state
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedIsAuth = localStorage.getItem("isAuthenticated") === "true";

    if (savedToken && savedIsAuth) {
      setToken(savedToken);
      setRole(savedRole);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("isAuthenticated", "true");
    setToken(newToken);
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <div className="text-xl font-bold text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
