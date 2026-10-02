import React from 'react';
import { GraduationCap, ShieldCheck, ArrowUp } from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { schoolData } = useSchool();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">
                {schoolData.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {schoolData.tagline}. Dedicated to fostering intellectual capability, moral discipline, and high board examination achievements since 1995.
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              <div>Address: Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra 282010</div>
              <div>Telephone: 0562 221 4303 · Recognized Intermediate Science & Arts College</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white transition-colors">College History (Est. 1995)</a></li>
              <li><a href="#facilities" className="hover:text-white transition-colors">Science & Computer Labs</a></li>
              <li><a href="#fees" className="hover:text-white transition-colors">Fee Structure (Nursery-12)</a></li>
              <li><a href="#leadership" className="hover:text-white transition-colors">Manager & Principal</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors">Online Student Registration</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Bodla Road Location Map</a></li>
            </ul>
          </div>

          {/* Governance & Admin Access */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Institutional Administration
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized college leadership may access the administrative console to adjust class fees, update operating hours, and manage student admission dossiers.
            </p>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Owner & Management Login</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} New Sunflower Inter College, Agra. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
