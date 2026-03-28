import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Button } from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://192.168.1.70:8000/api/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setMessage(data.message);
      } else {
        setError(data.error || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-10 md:p-14 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-accent transition-colors mb-8">
            <FaArrowLeft /> Back to Login
          </Link>

          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2 text-center">Reset Gear</h2>
              <p className="text-gray-500 font-medium mb-10 text-center">Lost your access? Enter your email to begin recovery.</p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
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

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Dispatching..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="py-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">Transmission Sent</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                If an account exists for <span className="text-gray-900 font-bold">{email}</span>, you'll receive a recovery link shortly.
              </p>
              <div className="mt-10">
                <Link to="/login">
                  <Button variant="secondary" className="w-full py-4 text-[10px] font-black uppercase tracking-widest">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
