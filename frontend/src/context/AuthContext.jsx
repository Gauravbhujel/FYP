import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear potentially lingering state unconditionally on app start
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
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
