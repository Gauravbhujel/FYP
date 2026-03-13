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
    <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
      <div className="max-w-[600px] w-[90%] bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* <span className="text-[22px]">🏪</span> */}
          <h2 className="m-0">GearUp Nepal</h2>
        </div>

        <h3 className="mt-2.5">Welcome Back</h3>
        <p className="text-[#6b7280] text-sm mb-5">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div className="text-left mb-4">
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center bg-white p-2.5 rounded-md border border-[#ced4da] mt-1.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <FaEnvelope className="text-lg text-[#6c757d]" />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-none outline-none bg-transparent w-full ml-2"
              />
            </div>
          </div>

          <div className="text-left mb-4">
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center bg-white p-2.5 rounded-md border border-[#ced4da] mt-1.5 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <FaLock className="text-lg text-[#6c757d]" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-none outline-none bg-transparent w-full ml-2"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[13px] mb-5">
            <label className="">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="no-underline text-[#2563eb]">
              Forgot password?
            </span>
          </div>

          <button
            className="w-full p-3 border-none bg-secondary text-white rounded-lg text-[15px] cursor-pointer font-semibold hover:bg-[#157347]"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <div className="h-px bg-[#e5e7eb] my-5"></div>

        <p className="text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary no-underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
