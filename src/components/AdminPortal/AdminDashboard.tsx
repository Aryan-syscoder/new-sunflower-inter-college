import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Users,
  Clock,
  DollarSign,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { AdminApplicationsTab } from './AdminApplicationsTab.tsx';
import { AdminFeesTab } from './AdminFeesTab.tsx';
import { AdminTimingsTab } from './AdminTimingsTab.tsx';
import { AdminOutboxTab } from './AdminOutboxTab.tsx';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { adminUser, logout, applications, emailLogs, schoolData, resetToDemo } = useSchool();
  const [activeTab, setActiveTab] = useState<'applications' | 'fees' | 'timings' | 'outbox'>('applications');
  const [isResetting, setIsResetting] = useState(false);

  // Compute stats
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'Under Review').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const cancelledApps = applications.filter((a) => a.status === 'Cancelled').length;

  const handleResetData = async () => {
    if (window.confirm('Reset all applications, fees, and timings to default initial demo data?')) {
      setIsResetting(true);
      await resetToDemo();
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  New Sunflower Administrative Console
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Owner Desk
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Logged in as <strong>{adminUser?.name || 'Administrator'}</strong> ({adminUser?.email})
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              title="Reset Demo Records"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Animated Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Registrations</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2 tabular-nums">
              {totalApps}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Nursery to Class 12 candidates</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
              <span>Under Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-800 mt-2 tabular-nums">
              {pendingApps}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Awaiting decision or interview</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span>Approved Offers</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800 mt-2 tabular-nums">
              {approvedApps}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Provisional letters dispatched</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
              <span>Cancelled / Rejected</span>
              <Mail className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-rose-800 mt-2 tabular-nums">
              {cancelledApps}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Automatic notices dispatched</div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-fit">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Applications</span>
            <span className="px-1.5 py-0.2 bg-slate-100 rounded-full font-mono text-[11px] text-slate-700">
              {totalApps}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fees'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Class Fees Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('timings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>School Timings</span>
          </button>

          <button
            onClick={() => setActiveTab('outbox')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'outbox'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Automated Email Outbox</span>
            <span className="px-1.5 py-0.2 bg-slate-100 rounded-full font-mono text-[11px] text-slate-700">
              {emailLogs.length}
            </span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <AnimatePresence mode="wait">
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminApplicationsTab />
            </motion.div>
          )}

          {activeTab === 'fees' && (
            <motion.div
              key="fees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminFeesTab />
            </motion.div>
          )}

          {activeTab === 'timings' && (
            <motion.div
              key="timings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminTimingsTab />
            </motion.div>
          )}

          {activeTab === 'outbox' && (
            <motion.div
              key="outbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminOutboxTab />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
};
