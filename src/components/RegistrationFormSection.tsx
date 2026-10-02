import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Mail,
  Send,
  Loader2,
  FileText,
  Printer,
  X,
  AlertCircle,
  Sparkles,
  Phone,
  User,
  Calendar,
  Home,
  GraduationCap,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';
import { GradeLevel, StudentApplication } from '../types.ts';

const GRADES_LIST: GradeLevel[] = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11 - Science',
  'Class 11 - Commerce',
  'Class 11 - Humanities',
  'Class 12 - Science',
  'Class 12 - Commerce',
  'Class 12 - Humanities',
];

interface FormErrors {
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  classApplied?: string;
  phone?: string;
  email?: string;
  permanentAddress?: string;
}

export const RegistrationFormSection: React.FC = () => {
  const { registerStudent, selectedGradeForApply, setSelectedGradeForApply, schoolData } = useSchool();

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    classApplied: (selectedGradeForApply || 'Class 1') as GradeLevel,
    phone: '',
    email: '',
    permanentAddress: '',
    previousSchool: '',
    emergencyContact: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState<StudentApplication | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync when selectedGradeForApply changes from Fee Structure section
  useEffect(() => {
    if (selectedGradeForApply) {
      setFormData((prev) => ({ ...prev, classApplied: selectedGradeForApply }));
    }
  }, [selectedGradeForApply]);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) errs.fullName = 'Student Full Name is required';
    if (!formData.fatherName.trim()) errs.fatherName = "Father's Full Name is required";
    if (!formData.motherName.trim()) errs.motherName = "Mother's Full Name is required";
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid contact number';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required for admissions confirmation';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.permanentAddress.trim()) {
      errs.permanentAddress = 'Permanent residential address is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerStudent({
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        classApplied: formData.classApplied,
        phone: formData.phone,
        email: formData.email,
        permanentAddress: formData.permanentAddress,
        previousSchool: formData.previousSchool || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        notes: formData.notes || undefined,
      });

      if (res.success && res.application) {
        setSuccessModalData(res.application);

        // Confetti explosion
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        // Reset form
        setFormData({
          fullName: '',
          fatherName: '',
          motherName: '',
          dateOfBirth: '',
          classApplied: 'Class 1',
          phone: '',
          email: '',
          permanentAddress: '',
          previousSchool: '',
          emergencyContact: '',
          notes: '',
        });
        setSelectedGradeForApply(null);
      } else {
        setServerError('Submission could not be completed. Please check all fields.');
      }
    } catch (err: any) {
      setServerError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="admissions" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            05. Online Admissions Portal
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Student Registration Form (Session 2026–2027)
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Apply online for admission into New Sunflower Inter College (Nursery to Class 12, including recognized Intermediate Arts and Science streams).
            Upon submission, an immediate two-way email confirmation is delivered.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
          
          {serverError && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Candidate Identity */}
            <div>
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Part 1: Student Particulars
                </span>
                <span className="text-xs text-slate-500">Required fields marked with *</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        errors.fullName ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
                </div>

                {/* Class Applied For */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Class Applied For *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.classApplied}
                      onChange={(e) => setFormData({ ...formData, classApplied: e.target.value as GradeLevel })}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                    >
                      {GRADES_LIST.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        errors.dateOfBirth ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-xs text-rose-600 mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Previous School */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Previous School / Preschool (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Montessori School, Delhi"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Parent / Guardian Particulars */}
            <div>
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Part 2: Parent & Family Particulars
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Father's Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors.fatherName ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.fatherName && <p className="text-xs text-rose-600 mt-1">{errors.fatherName}</p>}
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mother's Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Sharma"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors.motherName ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.motherName && <p className="text-xs text-rose-600 mt-1">{errors.motherName}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Permanent Address */}
            <div>
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Part 3: Communication & Residential Details
                </span>
                <span className="text-xs text-slate-500">Automated confirmation dispatched here</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98112 34567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        errors.phone ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="parent.name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        errors.email ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                {/* Permanent Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Permanent Residential Address *
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      placeholder="House/Apartment number, Street, City, State, PIN Code"
                      value={formData.permanentAddress}
                      onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        errors.permanentAddress ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.permanentAddress && <p className="text-xs text-rose-600 mt-1">{errors.permanentAddress}</p>}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Emergency Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Alternate Guardian Contact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Special remarks */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Special Talents, Interests, or Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swimmer, robotics club, bus route requirement"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <strong>Automated Two-Way Email Protocol:</strong> Submitting this registration
                dispatches an immediate dossier copy to the School Owner ({schoolData.contact.ownerEmail})
                and an official confirmation notice to your provided email address.
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Admissions Desk Helpline: {schoolData.contact.phone}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering & Dispatching Emails...</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* REGISTRATION SUCCESS POP-UP (Compact, fully visible at a glance) */}
      <AnimatePresence>
        {successModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
            >
              {/* Top Banner (Compact header) */}
              <div className="bg-slate-900 text-white p-5 text-center relative shrink-0">
                <button
                  onClick={() => setSuccessModalData(null)}
                  className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 15 }}
                  className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Registration Successful!
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Application recorded and submitted to New Sunflower Inter College.
                </p>

                {/* Application Reference ID (Sleek pill) */}
                <div className="mt-2.5 inline-block bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/15">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">
                    Application Reference Number
                  </div>
                  <div className="font-mono text-base font-bold text-white tracking-widest mt-0.5">
                    {successModalData.applicationNumber}
                  </div>
                </div>
              </div>

              {/* Modal Body & Automated Email Summary */}
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                {/* Particulars Card */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-semibold text-slate-900">{successModalData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Class Applied:</span>
                    <span className="font-semibold text-slate-900">{successModalData.classApplied}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Parents:</span>
                    <span className="font-medium text-slate-800">{successModalData.fatherName} & {successModalData.motherName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {successModalData.status}
                    </span>
                  </div>
                </div>

                {/* Automated Email Confirmation Indicator */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/90 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span className="truncate">Confirmation sent to <strong>{successModalData.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 bg-blue-50/90 p-2 rounded-lg border border-blue-200">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                    <span className="truncate">Alert delivered to College Office ({schoolData.contact.ownerEmail})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 flex gap-2.5">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => setSuccessModalData(null)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
