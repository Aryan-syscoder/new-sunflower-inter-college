import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateToApply: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onNavigateToApply }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, adminUser } = useSchool();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Fee Structure', href: '#fees' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text wordmark */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
            New Sunflower Inter College
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.href)}
              className="hover:text-slate-900 transition-colors py-1 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}</span>
            {isAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={onNavigateToApply}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <span>Apply 2026–27</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.href)}
                  className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToApply();
                }}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 rounded-lg"
              >
                Apply for Admission 2026–27
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAuthenticated ? 'Open Admin Dashboard' : 'Owner / Admin Login'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
