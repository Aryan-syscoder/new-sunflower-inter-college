import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Navigation,
  Star,
  Quote,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';

export const ContactSection: React.FC = () => {
  const { schoolData } = useSchool();
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.message) return;
    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const whatsappNumberClean = schoolData.contact.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumberClean}?text=${encodeURIComponent(
    'Hello New Sunflower Inter College, Agra. I would like to inquire about admission and intermediate streams.'
  )}`;

  return (
    <section id="contact" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            06. Contact & Location
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Visit New Sunflower Inter College, Agra
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Conveniently located near Mahadev Mandir on Bodla Road, Agra. We welcome parents and students
            for campus visits, subject counseling, and registration inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contacts & WhatsApp & Reviews */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Functional WhatsApp Card */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.01 }}
              className="block p-6 rounded-2xl bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
                      WhatsApp Admissions Desk
                    </div>
                    <div className="text-lg font-bold">Chat with College Office</div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-white/80" />
              </div>
              <p className="mt-3 text-xs text-emerald-100">
                Click to message our office regarding admission forms, fee payment, and stream allocation.
              </p>
            </motion.a>

            {/* Direct Contact Particulars */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
              
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900 shrink-0">
                  <Phone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Telephone Helpline</div>
                  <a
                    href="tel:05622214303"
                    className="text-lg font-bold text-slate-900 hover:text-amber-700 transition-colors"
                  >
                    0562 221 4303
                  </a>
                  <div className="text-xs text-slate-500 mt-0.5">Lines active 7:00 AM to 3:00 PM</div>
                </div>
              </div>

              {/* Hours / Schedule Notice */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">College Working Hours</div>
                  <div className="text-sm font-bold text-slate-900">
                    Opens 7:00 AM · Closes 3:00 PM (Monday to Saturday)
                  </div>
                  <div className="text-xs text-amber-800 mt-1">
                    * Gandhi Jayanti and public festivals might affect these hours.
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-800 shrink-0">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Campus Physical Address</div>
                  <p className="text-sm text-slate-900 font-medium mt-0.5">
                    Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra, Uttar Pradesh 282010
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Get there: approx. 9 mins drive from Bodla Crossing.
                  </p>
                  <a
                    href={schoolData.contact.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800 shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Official Admissions Email</div>
                  <a
                    href={`mailto:${schoolData.contact.email}`}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {schoolData.contact.email}
                  </a>
                </div>
              </div>

            </div>

            {/* Public Community Ratings & Reviews Box */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Community Reviews
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold font-serif text-slate-900">3.8</span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                      <Star className="w-4 h-4 text-slate-300" />
                    </div>
                    <span className="text-xs text-slate-500">148 Google reviews</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-700">4.0 / 5</span>
                  <div className="text-[11px] text-slate-500">Justdial (149 votes)</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Kapil Kant Swaroop:</strong> "My cousin reads here... good teaching for science and arts."
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>From College Desk:</strong> “New Sunflower Inter College” was established in year 1995. Continuous improvements in lab facilities and student welfare.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Quick Enquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                Send an Admission Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Have questions about Intermediate Science or Arts seats, school bus routes, or fee schedules?
                Send us a note and our office will get back to you promptly.
              </p>

              {enquirySent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-emerald-900">Inquiry Dispatched!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you. The New Sunflower Inter College administrative office has received your query.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Student / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kapil Kant Swaroop"
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0562 221 4303 / Mobile"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Query (Class / Stream Applied For) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Inquiring about Class 11 Science Stream admission, practical exam timings, and bus availability from Bodla..."
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Query to College Office</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
