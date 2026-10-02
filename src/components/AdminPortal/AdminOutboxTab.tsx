import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, Eye, X, Send, Search, ExternalLink } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { EmailLog } from '../../types.ts';

export const AdminOutboxTab: React.FC = () => {
  const { emailLogs } = useSchool();
  const [search, setSearch] = useState('');
  const [previewEmail, setPreviewEmail] = useState<EmailLog | null>(null);

  const filtered = emailLogs.filter(
    (log) =>
      log.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      log.templateType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Automated Two-Way Email Outbox & Logs
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of all automated dispatches (Double-sided registration notices, cancellation alerts, offer letters).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Outbox List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Recipient</th>
              <th className="py-3.5 px-3">Role / Channel</th>
              <th className="py-3.5 px-4">Email Subject Line</th>
              <th className="py-3.5 px-3">Dispatched At</th>
              <th className="py-3.5 px-3">Delivery Status</th>
              <th className="py-3.5 px-4 text-right">Inspect Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No automated email records found.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{log.recipientName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{log.recipientEmail}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.recipientType === 'Owner'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {log.recipientType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                    {log.subject}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono tabular-nums">
                    {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(log.sentAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setPreviewEmail(log)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview HTML</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* HTML EMAIL INSPECTOR MODAL */}
      <AnimatePresence>
        {previewEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-slate-900 text-white flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Email Inspector · {previewEmail.templateType}
                  </div>
                  <h4 className="font-serif text-lg font-bold mt-0.5">
                    {previewEmail.subject}
                  </h4>
                  <div className="text-xs text-slate-300 mt-1">
                    To: <strong>{previewEmail.recipientEmail}</strong> ({previewEmail.recipientName})
                  </div>
                </div>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rendered HTML inside iframe / container */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
                <div
                  className="bg-white rounded-xl shadow-xs border border-slate-200 p-2 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: previewEmail.htmlContent }}
                />
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Dispatched: {new Date(previewEmail.sentAt).toLocaleString()}</span>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
