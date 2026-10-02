import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle2, RotateCcw, Search, Sparkles, AlertCircle } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { FeeItem } from '../../types.ts';

export const AdminFeesTab: React.FC = () => {
  const { schoolData, updateFees } = useSchool();
  const [feesList, setFeesList] = useState<FeeItem[]>(() => JSON.parse(JSON.stringify(schoolData.fees)));
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFieldChange = (id: string, field: keyof FeeItem, value: any) => {
    setFeesList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        // If monetary field changed, recompute total annual
        if (
          field === 'admissionFee' ||
          field === 'tuitionFeePerQuarter' ||
          field === 'activityLabFee' ||
          field === 'developmentChargeAnnual'
        ) {
          const numVal = Math.max(0, Number(value) || 0);
          updated[field] = numVal as any;
          updated.totalAnnualFee =
            (field === 'admissionFee' ? numVal : updated.admissionFee) +
            (field === 'tuitionFeePerQuarter' ? numVal : updated.tuitionFeePerQuarter) * 4 +
            (field === 'activityLabFee' ? numVal : updated.activityLabFee) +
            (field === 'developmentChargeAnnual' ? numVal : updated.developmentChargeAnnual);
        }
        return updated;
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const ok = await updateFees(feesList);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMsg('Failed to persist fee changes.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error updating fee records.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFeesList(JSON.parse(JSON.stringify(schoolData.fees)));
  };

  const filtered = feesList.filter(
    (f) =>
      f.grade.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Nursery to 12th Class Fee Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Edit tuition, admission fees, or seat availability. Changes publish live immediately to the public portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Edits</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Publishing Live...' : 'Publish Fee Updates'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fee structure successfully saved and broadcast live to the main landing page!</span>
        </motion.div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Editable Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Class / Grade</th>
              <th className="py-3.5 px-3">Admission Fee (₹)</th>
              <th className="py-3.5 px-3">Tuition / Quarter (₹)</th>
              <th className="py-3.5 px-3">Activity & Lab (₹)</th>
              <th className="py-3.5 px-3">Annual Dev (₹)</th>
              <th className="py-3.5 px-3 text-right">Computed Annual</th>
              <th className="py-3.5 px-4">Seat Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  <div>{item.grade}</div>
                  <div className="text-[10px] font-normal text-slate-500">{item.category}</div>
                </td>

                {/* Admission Fee */}
                <td className="py-2.5 px-3">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={item.admissionFee}
                    onChange={(e) => handleFieldChange(item.id, 'admissionFee', e.target.value)}
                    className="w-28 px-2 py-1 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </td>

                {/* Tuition Fee Per Quarter */}
                <td className="py-2.5 px-3">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={item.tuitionFeePerQuarter}
                    onChange={(e) => handleFieldChange(item.id, 'tuitionFeePerQuarter', e.target.value)}
                    className="w-28 px-2 py-1 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </td>

                {/* Activity & Lab */}
                <td className="py-2.5 px-3">
                  <input
                    type="number"
                    min={0}
                    step={250}
                    value={item.activityLabFee}
                    onChange={(e) => handleFieldChange(item.id, 'activityLabFee', e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </td>

                {/* Annual Development Charge */}
                <td className="py-2.5 px-3">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={item.developmentChargeAnnual}
                    onChange={(e) => handleFieldChange(item.id, 'developmentChargeAnnual', e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </td>

                {/* Computed Total */}
                <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                  ₹{item.totalAnnualFee.toLocaleString('en-IN')}
                </td>

                {/* Seat Availability */}
                <td className="py-2.5 px-4">
                  <select
                    value={item.seatAvailability}
                    onChange={(e) => handleFieldChange(item.id, 'seatAvailability', e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded border focus:outline-none ${
                      item.seatAvailability === 'Open'
                        ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                        : item.seatAvailability === 'Limited Seats'
                        ? 'border-amber-300 text-amber-800 bg-amber-50'
                        : 'border-rose-300 text-rose-800 bg-rose-50'
                    }`}
                  >
                    <option value="Open">Open</option>
                    <option value="Limited Seats">Limited Seats</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
