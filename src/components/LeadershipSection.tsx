import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Quote, Sparkles } from 'lucide-react';
import { schoolImages } from '../assets/images.ts';

export const LeadershipSection: React.FC = () => {
  const leaders = [
    {
      role: 'Manager & Founder Trustee',
      name: 'Shri S. P. Sharma',
      qualifications: 'M.A., LL.B., Senior Educationalist (Agra)',
      tenure: 'Founder of New Sunflower Inter College (Est. 1995)',
      photo: schoolImages.directorPhoto,
      honors: [
        'Founded New Sunflower Inter College in 1995 with a mission of affordable education',
        'Spearheaded UP Board recognition in Intermediate Science and Arts Streams',
        'Over 30 years of dedicated service to Agra students and community development',
      ],
      message:
        '“When we established New Sunflower Inter College in 1995 on Bodla Road, our dream was simple yet profound: to ensure that every deserving student in our Agra community has access to quality education, proper scientific laboratories, and strong moral grounding. Seeing thousands of our alumni succeed across diverse fields is our greatest reward.”',
    },
    {
      role: 'Principal & Academic Head',
      name: 'Dr. Manisha Gupta',
      qualifications: 'M.Sc. Chemistry, M.Ed., Ph.D. in Pedagogy',
      tenure: '20+ Years in Curriculum Mentorship & Board Examinations',
      photo: schoolImages.principalPhoto,
      honors: [
        'District Honor for Consistent Intermediate Board Examination Results',
        'Head of Science Stream Practical Examination Panel, Agra',
        'Pioneer of student doubt-clearing and personalized mentoring clinics',
      ],
      message:
        '“Our focus remains steadfast on helping every student master foundational concepts in Science and Arts. We believe in continuous classroom effort, regular laboratory practice, and compassionate teacher guidance. Every student who walks into our college is supported to realize their highest academic and personal potential.”',
    },
  ];

  return (
    <section id="leadership" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            03. College Leadership & Vision
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Dedicated Leadership Guiding New Sunflower Since 1995
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Our Manager and Principal bring decades of hands-on educational stewardship,
            focusing on student welfare, discipline, and consistent board examination results.
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {leaders.map((leader, idx) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="p-8 sm:p-10 space-y-6">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-200">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md bg-slate-200">
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      {leader.role}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">
                      {leader.name}
                    </h3>
                    <div className="text-xs font-medium text-slate-700">
                      {leader.qualifications}
                    </div>
                    <div className="text-xs text-slate-500">
                      {leader.tenure}
                    </div>
                  </div>
                </div>

                {/* Leader Message */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-slate-300 absolute -top-3 -left-2 -z-0 opacity-40" />
                  <p className="relative z-10 text-sm sm:text-base font-serif italic text-slate-700 leading-relaxed">
                    {leader.message}
                  </p>
                </div>

                {/* Key Honors & Accreditations */}
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Key Contributions & Milestones
                  </div>
                  <ul className="space-y-2">
                    {leader.honors.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Bottom Card Footer */}
              <div className="px-8 sm:px-10 py-4 bg-slate-100/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span>Administrative Office · New Sunflower Inter College</span>
                <span className="font-semibold text-slate-800">Bodla Road, Agra (UP)</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
