import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const [accountType, setAccountType] = useState("customer");
  const navigate = useNavigate();

  // Fields sent to backend
  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Security
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully 🎉");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      alert("Failed to connect to backend. Is Django running?");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[720px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block text-2xl font-black uppercase tracking-tighter mb-4">
              GearUp <span className="text-accent underline decoration-2 underline-offset-4">Nepal</span>
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Join Nepal's premier sports marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Personal Information</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">First Name</label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Last Name</label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Email Address</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Phone Number</label>
                  <div className="relative group">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="+977"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Username</label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Confirm Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent accent-accent cursor-pointer" />
                <span className="text-xs font-bold text-gray-500 transition-colors">
                  I agree to the <span className="text-accent underline">Terms of Service</span> and <span className="text-accent underline">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button
              className="w-full py-4 bg-accent text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all duration-300"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col gap-4">
            <p className="text-center text-gray-500 font-medium text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-black uppercase tracking-widest text-[10px] ml-2">
                Sign In
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="h-px w-8 bg-gray-100"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Or Register as Vendor</span>
              <div className="h-px w-8 bg-gray-100"></div>
            </div>
            <Link
              to="/vendor/signup"
              className="w-full py-3 border border-gray-200 rounded-lg text-center text-[10px] font-black uppercase tracking-widest text-gray-600 transition-colors"
            >
              Become a Vendor <FaArrowRight className="inline-block ml-2 text-[8px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
