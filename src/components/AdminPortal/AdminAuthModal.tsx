import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { requestOtp, loginWithOtp, schoolData } = useSchool();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState(schoolData.contact.ownerEmail || 'souravpachori08@gmail.com');
  const [otp, setOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await requestOtp(email);
      if (res.success) {
        setStep('otp');
        setInfoMessage(res.message);
        if (res.demoOtp) {
          setDemoOtpCode(res.demoOtp);
        }
      } else {
        setError('Could not transmit verification code. Please check email address.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginWithOtp(email, otp);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoCode = () => {
    if (demoOtpCode) {
      setOtp(demoOtpCode);
    } else {
      setOtp('123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            &times;
          </button>

          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-amber-300" />
          </div>

          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Administrative Access Control
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mt-1">
            Manager & Principal Desk
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Secure two-factor credential verification for New Sunflower Inter College management.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Administrator Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@oakridgeglobal.edu"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Registered Owner: <strong>{schoolData.contact.ownerEmail}</strong>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                A 6-digit one-time cryptographic passcode will be dispatched to this email address to verify identity.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Security Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {infoMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{infoMessage}</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Enter 6-Digit One-Time Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 849201"
                    className="w-full pl-9 pr-3 py-2.5 text-base tracking-widest font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Enter Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
