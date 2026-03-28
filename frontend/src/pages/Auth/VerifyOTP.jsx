import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { Button } from "../../components/ui/Button";
import api from "../../api";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back to forgot password
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("verify-reset-otp/", { email, otp });
      setMessage(response.data.message);
      // Redirect to reset password after 2 seconds
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("forgot-password/", { email });
      setMessage("A new OTP has been sent to your email.");
      setError("");
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-10 md:p-14">
          <div className="text-center mb-10">
            <Link to="/forgot-password" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors mb-6">
              <FaArrowLeft /> Back
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Verify OTP</h2>
            <p className="text-gray-500 font-medium">We've sent a 6-digit verification code to <span className="text-gray-900 font-bold">{email}</span>.</p>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">6-Digit Code</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium placeholder:text-gray-300 tracking-[0.5em] text-center"
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Didn't receive code?{" "}
              <button onClick={handleResend} className="text-accent underline hover:text-[#EA580C] ml-1">Resend OTP</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
