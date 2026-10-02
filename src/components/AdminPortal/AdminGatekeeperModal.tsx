import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Eye, EyeOff, KeyRound, Loader2, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { AdminDashboard } from './AdminDashboard.tsx';

interface AdminGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGatekeeperModal: React.FC<AdminGatekeeperModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, loginWithPassword, adminUser } = useSchool();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the Admin Security Password');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await loginWithPassword(password);
      if (res.success) {
        setIsUnlockedSuccess(true);
      } else {
        setError(res.error || 'Incorrect Admin Security Password. Access Denied.');
      }
    } catch (err: any) {
      setError(err?.message || 'Access Denied. Please check your security password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isAuthenticated && !isUnlockedSuccess ? (
          /* GATEKEEPER SCREEN (Completely isolated, beautifully centered, single input field) */
          <motion.div
            key="gatekeeper-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative"
          >
            {/* Close modal cross */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header branding */}
            <div className="p-8 pb-6 text-center bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 mx-auto flex items-center justify-center mb-4 shadow-2xs"
              >
                <Lock className="w-8 h-8" />
              </motion.div>

              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Direct Password Gatekeeper
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                Admin Security Access
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 max-w-xs mx-auto">
                Authorized management portal for New Sunflower Inter College, Agra.
              </p>
            </div>

            {/* Single Input Form */}
            <form onSubmit={handlePasswordSubmit} className="p-8 pt-6 space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* SINGLE INPUT FIELD */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Security Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Unlock Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Security Key...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Unlock Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Return to Public Website
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* FULL ADMIN DASHBOARD (Dynamically animated in upon successful password unlock) */
          <motion.div
            key="admin-dashboard-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <AdminDashboard onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
