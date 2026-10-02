import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Activity, Monitor, BookOpen, Building, Palette, X, CheckCircle2 } from 'lucide-react';
import { schoolImages } from '../assets/images.ts';

interface Facility {
  id: string;
  name: string;
  category: string;
  image?: string;
  icon: any;
  summary: string;
  specs: string[];
  equipment: string[];
  capacity: string;
}

export const FacilitiesSection: React.FC = () => {
  const [activeModal, setActiveModal] = useState<Facility | null>(null);

  const facilities: Facility[] = [
    {
      id: 'science-labs',
      name: 'Intermediate Science Laboratories (Physics & Chemistry)',
      category: 'Recognized Science Stream',
      image: schoolImages.stemLabPhoto,
      icon: Microscope,
      summary: 'Practical science laboratory equipped for UP Board Intermediate syllabus demonstrations in optical benches, titration apparatus, electrical circuits, and chemical reaction tables.',
      specs: [
        'Dedicated Physics experimental apparatus (potentiometer, prism, sonometer)',
        'Chemistry titration tables, reagent shelves, and fume safety vents',
        'Biology dissection models, microscope slides, and botanical charts',
        'Board examination certified practical laboratory center',
      ],
      equipment: ['Compound Microscopes', 'Physical Balances & Weights', 'Glassware & Chemical Reagents'],
      capacity: '40 Students per batch',
    },
    {
      id: 'sports-ground',
      name: 'College Sports Ground & Athletics Arena',
      category: 'Physical Education & Drill',
      image: schoolImages.sportsComplexPhoto,
      icon: Activity,
      summary: 'Outdoor open play area supporting volleyball, kho-kho, cricket pitch nets, badminton courts, and regular morning assembly drills.',
      specs: [
        'Standard volleyball and badminton playing courts',
        'Cricket practice net with bowling crease',
        'Morning yoga, calisthenics, and physical exercise grounds',
        'Annual sports day track events and inter-school tournaments',
      ],
      equipment: ['Volleyball Nets & Regulated Balls', 'Cricket Practice Gear', 'Athletic Markers'],
      capacity: 'Full Student Cohort',
    },
    {
      id: 'computer-center',
      name: 'Computer Education & Practical IT Lab',
      category: 'Technology & Digital Literacy',
      icon: Monitor,
      summary: 'Air-cooled computer laboratory providing foundational training in MS Office, basic programming concepts, typing skills, and internet research.',
      specs: [
        'Modern networked desktop computer workstations',
        'Curriculum focused on digital literacy and office applications',
        'Uninterrupted battery power backup for practical exams',
        'Teacher-supervised web access for academic references',
      ],
      equipment: ['Desktop PCs with Windows & Linux', 'Laser Printers', 'UPS Power Backup'],
      capacity: '30 Students per Session',
    },
    {
      id: 'library',
      name: 'College Library & Reading Room',
      category: 'Arts & Humanities Resources',
      icon: BookOpen,
      summary: 'Extensive repository of textbooks, solved question papers, model test papers, literary classics in Hindi and English, and regional newspapers.',
      specs: [
        'Over 6,000 prescribed course books and reference manuals',
        'Past 10 years solved UP Board question paper archive',
        'Daily Hindi and English newspapers and general knowledge periodicals',
        'Quiet study hall for intermediate self-study during free hours',
      ],
      equipment: ['Book Lending Registers', 'Reading Carrels', 'Reference Periodical Shelves'],
      capacity: '60 Students',
    },
    {
      id: 'arts-room',
      name: 'Intermediate Arts & Humanities Workshop',
      category: 'Recognized Arts Stream',
      icon: Palette,
      summary: 'Interactive lecture and display hall for History, Civics, Geography map work, and Hindi literature symposiums.',
      specs: [
        'Geographical topographical maps and globes',
        'Historical timelines and Indian heritage pictorial displays',
        'Elocution, debate, and essay writing club activities',
        'Board answer writing guidance workshops',
      ],
      equipment: ['Relief Maps & Charts', 'Podium & Public Address Speaker', 'Display Boards'],
      capacity: '80 Students',
    },
    {
      id: 'assembly-hall',
      name: 'Central Assembly Grounds & Cultural Stage',
      category: 'Community & Values',
      icon: Building,
      summary: 'Central congregation courtyard for daily morning prayer, moral pledge, national festival celebrations (Independence Day, Republic Day, Gandhi Jayanti).',
      specs: [
        'Spacious open courtyard for daily prayer and physical exercises',
        'Elevated platform stage for cultural presentations and prize distribution',
        'Flag hoisting ceremony mast and audio speaker system',
        'Tree-lined peaceful environment in Keshar Vihar, Balaji Puram',
      ],
      equipment: ['Sound Amplifier & Microphones', 'National Flag Hoisting Mast', 'Seating Benches'],
      capacity: '500+ Attendees',
    },
  ];

  return (
    <section id="facilities" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            02. Campus Infrastructure
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Campus Facilities Built for Learning & Character
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Located in Keshar Vihar, Balaji Puram, Bodla Road, our campus provides well-maintained
            science practical laboratories, open sports grounds, and spacious classrooms.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;

            return (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActiveModal(fac)}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                {fac.image ? (
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                    <img
                      src={fac.image}
                      alt={fac.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/95">
                      {fac.category}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {fac.category}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {fac.image && (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {fac.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{fac.capacity}</span>
                    <span className="font-semibold text-slate-900 group-hover:underline">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Facility Details Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {activeModal.category}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                    {activeModal.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {activeModal.image && (
                  <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
                    <img
                      src={activeModal.image}
                      alt={activeModal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModal.summary}
                </p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Key Features & Academic Utility
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModal.specs.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Apparatus & Equipment
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                    {activeModal.equipment.map((eq, i) => (
                      <span key={i} className="bg-white px-2.5 py-1 rounded border border-slate-200">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
