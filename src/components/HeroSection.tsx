import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Star, MapPin, Clock, Award, BookOpen, CheckCircle, Navigation } from 'lucide-react';
import { schoolImages } from '../assets/images.ts';
import { useSchool } from '../context/SchoolContext.tsx';

interface HeroSectionProps {
  onApplyClick: () => void;
  onFeesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyClick, onFeesClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { schoolData } = useSchool();

  // Scroll parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const yHeroText = useTransform(smoothProgress, [0, 1], ['0%', '20%']);
  const scaleImage = useTransform(smoothProgress, [0, 1], [1, 1.08]);
  const yImageCard = useTransform(smoothProgress, [0, 1], ['0%', '-12%']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-20"
    >
      {/* Subtle architectural background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition & Editorial Heading */}
          <motion.div
            style={{ y: yHeroText }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Unboxed editorial kicker with subtle separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="text-amber-800 font-bold">Est. 1995 in Agra, UP</span>
              <span aria-hidden="true">·</span>
              <span>Intermediate Arts & Science Streams</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700">Bodla Road Campus</span>
            </div>

            {/* Display Headline with balanced line wrap */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.14] [text-wrap:balance]">
              Empowering Students with Knowledge and Tradition in Agra.
            </h1>

            {/* Sub-headline quote from official records */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
              <strong>“New Sunflower Inter College”</strong> was established in the year <strong>1995</strong>.
              With constant dedication and sustained academic progress, our college is recognized in both
              <strong> Intermediate Arts Stream</strong> and <strong> Intermediate Science Stream</strong>,
              providing affordable, high-quality education from Nursery through Class 12.
            </p>

            {/* Address & Hours Banner */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5 max-w-xl">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Address:</strong> Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra, UP 282010
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>College Hours: 07:00 AM – 03:00 PM</span>
                </div>
                <div className="text-slate-500">
                  Call: <a href="tel:05622214303" className="font-semibold text-slate-900 hover:underline">0562 221 4303</a>
                </div>
              </div>
            </div>

            {/* Primary Action Zone */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onApplyClick}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <span>Register for Admission 2026–27</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onFeesClick}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                View Fee Structure (Nursery to 12th)
              </button>
            </div>

            {/* Verified Public Ratings & Legacy */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                  <span>3.8</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline -mt-1" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">148 Google Reviews</div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                  <span>4.0</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline -mt-1" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">149 Justdial Votes</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tabular-nums">
                  30+
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Years Legacy (Since 1995)</div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Layered Campus Card & Direction Marker */}
          <motion.div
            style={{ y: yImageCard }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Decorative backplate */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/40 to-slate-200/50 rounded-3xl -rotate-1 pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white group">
              <div className="aspect-[4/3] overflow-hidden relative">
                <motion.img
                  style={{ scale: scaleImage }}
                  src={schoolImages.heroCampus}
                  alt="New Sunflower Inter College Campus Agra"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Image caption */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                    Bodla Road, Agra Campus
                  </div>
                  <div className="text-base font-medium font-serif mt-0.5">
                    New Sunflower Inter College, Agra
                  </div>
                </div>
              </div>

              {/* Floating feature summary panel */}
              <div className="p-5 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Intermediate Recognition</span>
                  <span className="text-emerald-700 font-semibold">Arts & Science Streams</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated Physics, Chemistry & Biology Practical Labs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Recognized Intermediate Board Examination Center</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>9 mins from Bodla Crossing (near Mahadev Mandir)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating verification badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="hidden sm:flex absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 max-w-[230px] items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">Established 1995</div>
                <div className="text-[11px] text-slate-400">UP Board Recognized Inter College</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
