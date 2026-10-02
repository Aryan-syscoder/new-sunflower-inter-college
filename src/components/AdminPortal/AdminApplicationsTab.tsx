import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Download,
  AlertTriangle,
  Mail,
  Phone,
  Home,
  User,
  X,
  Loader2,
  Clock,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { StudentApplication } from '../../types.ts';

export const AdminApplicationsTab: React.FC = () => {
  const { applications, updateApplicationStatus, removeApplication } = useSchool();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  
  // Rejection/Cancellation Modal state
  const [rejectingApp, setRejectingApp] = useState<StudentApplication | null>(null);
  const [cancellationReason, setCancellationReason] = useState(
    'Current cohort seat capacity reached for this grade level for the 2026-27 session.'
  );
  const [customReason, setCustomReason] = useState('');
  const [removeRecordAfterCancel, setRemoveRecordAfterCancel] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Interview scheduling modal state
  const [schedulingApp, setSchedulingApp] = useState<StudentApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState('');

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.fullName.toLowerCase().includes(search.toLowerCase()) ||
        app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
        app.fatherName.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase()) ||
        app.phone.includes(search);
      const matchStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  // Handle Approve
  const handleApprove = async (app: StudentApplication) => {
    setIsProcessing(true);
    const ok = await updateApplicationStatus(app.id, 'Approved');
    setIsProcessing(false);
    if (ok) {
      setActionSuccessNotice(
        `Application ${app.applicationNumber} approved! Provisional admission offer email transmitted to ${app.email}.`
      );
      setTimeout(() => setActionSuccessNotice(null), 4000);
    }
  };

  // Handle Cancel / Reject confirmation (Removes application & triggers automated cancellation email)
  const handleConfirmCancel = async () => {
    if (!rejectingApp) return;
    setIsProcessing(true);
    const reason = customReason.trim() ? customReason.trim() : cancellationReason;
    const emailTarget = rejectingApp.email;
    const appNum = rejectingApp.applicationNumber;

    // Trigger cancellation status & email
    const ok = await updateApplicationStatus(rejectingApp.id, 'Cancelled', reason);

    // If removal requested, remove from roster
    if (ok && removeRecordAfterCancel) {
      await removeApplication(rejectingApp.id);
    }

    setIsProcessing(false);
    if (ok) {
      setActionSuccessNotice(
        `Application ${appNum} cancelled and removed from active roster. Automated cancellation email dispatched to ${emailTarget}.`
      );
      setRejectingApp(null);
      setCustomReason('');
      setTimeout(() => setActionSuccessNotice(null), 4500);
    }
  };

  // Handle Schedule Interview
  const handleConfirmInterview = async () => {
    if (!schedulingApp || !interviewDate) return;
    setIsProcessing(true);
    const ok = await updateApplicationStatus(
      schedulingApp.id,
      'Interview Scheduled',
      undefined,
      new Date(interviewDate).toISOString()
    );
    setIsProcessing(false);
    if (ok) {
      setActionSuccessNotice(
        `Interview scheduled for ${schedulingApp.fullName} on ${new Date(interviewDate).toLocaleString()}!`
      );
      setSchedulingApp(null);
      setInterviewDate('');
      setTimeout(() => setActionSuccessNotice(null), 4000);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Application Number',
      'Student Name',
      'Class Applied',
      'DOB',
      'Father Name',
      'Mother Name',
      'Phone',
      'Email',
      'Address',
      'Status',
      'Submitted At',
    ];

    const rows = applications.map((a) => [
      `"${a.applicationNumber}"`,
      `"${a.fullName}"`,
      `"${a.classApplied}"`,
      `"${a.dateOfBirth}"`,
      `"${a.fatherName}"`,
      `"${a.motherName}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.permanentAddress.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${new Date(a.submittedAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Oakridge_Admissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Search, Filters, and Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Student Admissions Dossier Roster
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total {applications.length} applications logged · Instant two-way status communication
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {actionSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {['All', 'Under Review', 'Approved', 'Cancelled', 'Interview Scheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Ref Number</th>
              <th className="py-3.5 px-4">Candidate Name</th>
              <th className="py-3.5 px-3">Class</th>
              <th className="py-3.5 px-4">Parent / Contact</th>
              <th className="py-3.5 px-3">Date Submitted</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{app.fullName}</div>
                    <div className="text-[11px] font-normal text-slate-500">DOB: {app.dateOfBirth}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-700">
                    {app.classApplied}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{app.fatherName}</div>
                    <div className="text-[11px] text-slate-500">{app.phone} · {app.email}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono tabular-nums">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* View details */}
                      <button
                        onClick={() => setSelectedApp(app)}
                        title="View Full Dossier"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Approve button */}
                      {app.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={isProcessing}
                          title="Approve & Send Offer Email"
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {/* Schedule interview */}
                      {app.status === 'Under Review' && (
                        <button
                          onClick={() => {
                            setSchedulingApp(app);
                            setInterviewDate(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));
                          }}
                          title="Schedule Diagnostic Interview"
                          className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}

                      {/* Cancel / Reject button */}
                      {app.status !== 'Cancelled' && (
                        <button
                          onClick={() => setRejectingApp(app)}
                          title="Cancel Application & Trigger Email"
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel / Reject
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FULL DOSSIER DRAWER / MODAL */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-slate-400">
                    {selectedApp.applicationNumber}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-0.5">
                    {selectedApp.fullName}
                  </h3>
                  <div className="text-xs text-amber-300 mt-1">
                    Applied for: {selectedApp.classApplied}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Father's Name:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mother's Name:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.motherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Notification Email:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Permanent Residence:</span>
                  <p className="mt-1 text-slate-800 font-medium">{selectedApp.permanentAddress}</p>
                </div>

                {selectedApp.previousSchool && (
                  <div>
                    <span className="text-slate-400 block">Previous Academic Institution:</span>
                    <p className="mt-1 text-slate-800">{selectedApp.previousSchool}</p>
                  </div>
                )}

                {selectedApp.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block mb-1">Special Talents / Parent Remarks:</span>
                    <p className="text-slate-700">{selectedApp.notes}</p>
                  </div>
                )}

                {selectedApp.rejectionReason && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800">
                    <span className="font-semibold block mb-0.5">Cancellation Reason Dispatched:</span>
                    <p>{selectedApp.rejectionReason}</p>
                  </div>
                )}

                {selectedApp.interviewDate && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-800">
                    <span className="font-semibold block mb-0.5">Scheduled Interview:</span>
                    <p>{new Date(selectedApp.interviewDate).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCELLATION / REJECTION CONFIRMATION MODAL (Triggers Automated Cancellation Email) */}
      <AnimatePresence>
        {rejectingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-rose-900 text-white flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                    Administrative Decision
                  </div>
                  <h3 className="font-serif text-xl font-bold mt-1">
                    Cancel Registration: {rejectingApp.fullName}
                  </h3>
                  <div className="text-xs text-rose-200">
                    Ref: {rejectingApp.applicationNumber} · Class: {rejectingApp.classApplied}
                  </div>
                </div>
                <button
                  onClick={() => setRejectingApp(null)}
                  className="text-rose-300 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Automated Cancellation Email Notice:</strong> Clicking confirm will
                    mark this application as <strong>Cancelled</strong> and instantly dispatch an
                    official status update email to <strong>{rejectingApp.email}</strong> detailing
                    the administrative remarks below.
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Standard Cancellation Notice Template
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    <option value="Current cohort seat capacity reached for this grade level for the 2026-27 session.">
                      Class seat quota reached for 2026–27 session
                    </option>
                    <option value="Required preliminary age criteria or grade documentation requirements could not be verified.">
                      Documentation or age eligibility requirement unmet
                    </option>
                    <option value="Application withdrawn upon parent request or geographical route boundary limitation.">
                      Parent withdrawal / transportation limitation
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Or Enter Custom Administrative Remarks (Sent to Parent)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter personalized notes to be included in the parent email notification..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={removeRecordAfterCancel}
                      onChange={(e) => setRemoveRecordAfterCancel(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span>Remove this application from the active student table after sending email</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRejectingApp(null)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Keep Application
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmCancel}
                    className="px-5 py-2 text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Email & Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Confirm Cancel & Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SCHEDULE INTERVIEW MODAL */}
      <AnimatePresence>
        {schedulingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-purple-900 text-white flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold">Schedule Parent Interaction</h3>
                  <p className="text-xs text-purple-200 mt-0.5">Candidate: {schedulingApp.fullName}</p>
                </div>
                <button onClick={() => setSchedulingApp(null)} className="text-purple-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Interaction Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSchedulingApp(null)}
                    className="px-4 py-2 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessing || !interviewDate}
                    onClick={handleConfirmInterview}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Schedule</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
