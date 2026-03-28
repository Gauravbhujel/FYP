import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Button } from "../../components/ui/Button";
import api from "../../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("forgot-password/", { email });
      setMessage(response.data.message);
      // Redirect to OTP verification after 2 seconds
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went default. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-10 md:p-14">
          <div className="text-center mb-10">
            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors mb-6">
              <FaArrowLeft /> Back to Login
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2 text-center">Forgot Password</h2>
            <p className="text-gray-500 font-medium text-center">Enter your email and we'll send you an OTP to reset your password.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-sm font-bold text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button
              variant="primary"
              className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
