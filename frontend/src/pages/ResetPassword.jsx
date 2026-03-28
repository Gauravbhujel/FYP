import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "../components/ui/Button";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passcodes do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://192.168.1.70:8000/api/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          uid, 
          token, 
          new_password: newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Token verification failed. This link may have expired.");
      }
    } catch (err) {
      setError("Failed to connect to the tactical backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[480px] w-full bg-white rounded-xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-10 md:p-14 text-center">
          
          {!isSuccess ? (
            <>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2 text-center">Initialize New Access</h2>
              <p className="text-gray-500 font-medium mb-10 text-center">Override your previous security protocol with a new passcode.</p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">New Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      placeholder="Enter new passcode"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Confirm Password</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      placeholder="Verify new passcode"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/5 font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-2">
                    <FaExclamationTriangle className="flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Rewriting Protocol..." : "Sync New Passcode"}
                </Button>
              </form>
            </>
          ) : (
            <div className="py-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">Sync Complete</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Security protocols have been updated. You can now access your account with the new credentials.
              </p>
              <div className="mt-10">
                <Button 
                  onClick={() => navigate("/login")}
                  variant="secondary" 
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  Login with New Passcode
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
