import React from 'react';
import { motion } from 'motion/react';
import { Clock, BookOpen, Compass, Trophy, HeartHandshake, CheckCircle2, Star, MapPin } from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';

export const AboutSection: React.FC = () => {
  const { schoolData } = useSchool();
  const { timings } = schoolData;

  const highlights = [
    {
      icon: BookOpen,
      title: 'Intermediate Arts & Science Streams',
      desc: 'Officially recognized by the State Intermediate Education Board for both Science Stream (Physics, Chemistry, Biology/Mathematics) and Arts Stream (Humanities, History, Civics).',
    },
    {
      icon: Compass,
      title: 'Blend of Traditional Values & Practical Learning',
      desc: 'Dedicated to traditional Indian pedagogical principles of discipline and respect while providing modern science practical labs and computer literacy.',
    },
    {
      icon: Trophy,
      title: 'Continuous Progress Since 1995',
      desc: 'Serving the educational needs of Agra students and families for over 30 continuous academic years with dedicated teaching staff and steady board performance.',
    },
    {
      icon: HeartHandshake,
      title: 'Affordable Quality Education',
      desc: 'Committed to accessible fee structures for every family in Keshar Vihar, Balaji Puram, Bodla, and surrounding Agra communities without hidden expenses.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            01. College History & Academic Recognition
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Established in 1995 with a Tradition of Progress in Agra
          </h2>
          <div className="mt-4 p-5 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <p className="text-base sm:text-lg text-slate-800 font-serif italic leading-relaxed">
              “<strong>New Sunflower Inter College</strong> was established in year <strong>1995</strong> and with constant effort and excellent progress in educational field, College get recognized in <strong>Intermediate Arts Stream</strong> and <strong>Intermediate Science Stream</strong>. Apart from Traditional education, the institution fosters discipline, practical scientific rigor, and all-round student development.”
            </p>
          </div>
        </div>

        {/* 4 Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Live Operating Timings Card (Agra Schedule: 7:00 AM – 3:00 PM) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-900 text-white p-8 lg:p-10 shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>College Daily Operational Timings & Shifts</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  Daily Class Hours & Administrative Timings
                </h3>
              </div>
              <div className="text-xs text-slate-300 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-semibold">Campus Schedule: </span>
                <span>Opens 7:00 AM · Closes 3:00 PM</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {/* Kindergarten & Primary */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Primary & Pre-Primary</div>
                <div className="text-2xl font-bold font-serif text-white mt-2 tabular-nums">
                  {timings.kindergarten.start} – {timings.kindergarten.end}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {timings.kindergarten.description}
                </p>
              </div>

              {/* Middle Section */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Junior High School (Classes 6–8)</div>
                <div className="text-2xl font-bold font-serif text-white mt-2 tabular-nums">
                  {timings.primary.start} – {timings.primary.end}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {timings.primary.description}
                </p>
              </div>

              {/* High School & Intermediate */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-medium">Intermediate (Arts & Science)</div>
                <div className="text-2xl font-bold font-serif text-white mt-2 tabular-nums">
                  {timings.secondary.start} – {timings.secondary.end}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {timings.secondary.description}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span><strong>Office Hours:</strong> Weekdays {timings.officeHours.weekdays}</span>
                <span aria-hidden="true">·</span>
                <span>Saturday opens 7:00 AM (Closes 1:00 PM)</span>
              </div>
              <div className="text-amber-300/80 italic">
                * Gandhi Jayanti, national festivals, and government district orders may adjust operating hours.
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
