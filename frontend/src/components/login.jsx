import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token); // Save the token!
        localStorage.setItem("role", data.role); // Save the role!

        // alert("Login successful ✅");

        // Check if there's a return path in location state
        const from = location.state?.from;

        if (from) {
          navigate(from, { replace: true });
        } else if (data.role === "vendor") {
          navigate("/vendor/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      alert("Failed to connect to backend. Is Django running?");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block text-2xl font-black uppercase tracking-tighter mb-4">
              GearUp <span className="text-accent underline decoration-2 underline-offset-4">Nepal</span>
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Clear values, clear goals. Access your gear.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Password</label>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer">Stay signed in for 30 days</label>
            </div>

            <button
              className="w-full py-4 bg-accent text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:bg-[#E65A00] hover:scale-[0.99] active:scale-95 transition-all duration-300"
              type="submit"
            >
              Sign In to GearUp
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-accent font-black uppercase tracking-widest text-[10px] ml-2 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
