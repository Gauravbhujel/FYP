import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Priority: location state > URL search param
    const emailFromState = location.state?.email;
    const emailFromQuery = searchParams.get("email");
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Email verified successfully 🎉");
        navigate("/login");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (error) {
      setError("Failed to connect to backend. Is Django running?");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block text-2xl font-black uppercase tracking-tighter mb-4">
              GearUp <span className="text-accent underline decoration-2 underline-offset-4">Nepal</span>
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Verify Email</h2>
            <p className="text-gray-500 font-medium tracking-wide">Enter the 6-digit OTP sent to your email.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your registered email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Verification Code (OTP)</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium tracking-[0.5em] text-center"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              className="w-full py-4 bg-accent text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all duration-300"
              type="submit"
            >
              Verify My Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
