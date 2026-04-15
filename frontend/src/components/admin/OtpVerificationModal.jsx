import React, { useState } from "react";
import { 
  ShieldCheckIcon, 
  XIcon, 
  LockIcon,
  Loader2Icon,
  AlertCircleIcon
} from "lucide-react";

export default function OtpVerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  verifying, 
  error 
}) {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-tr from-accent to-[#ff8c42] px-6 py-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors border-none bg-transparent cursor-pointer"
          >
            <XIcon size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/30">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Financial Authorization</h3>
            <p className="text-white/80 text-sm mt-1">Transaction Security Protocol</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              For your security, we've sent a 6-digit confirmation code to <span className="font-bold text-gray-900">gauravbhujel036@gmail.com</span>. Please enter it below to authorize the payout release.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <LockIcon size={18} />
              </div>
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit code"
                className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] text-gray-900 focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-base placeholder:font-medium"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium animate-shake">
                <AlertCircleIcon size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={otp.length !== 6 || verifying}
                className="w-full h-12 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-[#EA580C] hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                {verifying ? (
                  <>
                    <Loader2Icon size={18} className="animate-spin" />
                    Authorizing...
                  </>
                ) : (
                  "Authorize Release"
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full h-10 bg-transparent text-gray-500 font-semibold text-sm hover:text-gray-800 transition-colors border-none cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <ShieldCheckIcon size={14} className="text-emerald-500" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium leading-normal uppercase tracking-wider">
              Secure payments powered by GearUp Platform Security. Payouts are irreversible once authorized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
