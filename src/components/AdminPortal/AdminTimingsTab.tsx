import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle2, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.tsx';
import { SchoolTimings } from '../../types.ts';

export const AdminTimingsTab: React.FC = () => {
  const { schoolData, updateTimings } = useSchool();
  const [timings, setTimings] = useState<SchoolTimings>(() => JSON.parse(JSON.stringify(schoolData.timings)));
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const ok = await updateTimings(timings);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMsg('Failed to update school operating schedule.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error updating timings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTimings(JSON.parse(JSON.stringify(schoolData.timings)));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            School Operating Timings & Shifts
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Update cohort timings, office hours, and seasonal shifts. Reflects live immediately across the site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Updating...' : 'Publish Timings Live'}</span>
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
          <span>Timings successfully updated and published to the landing page!</span>
        </motion.div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cohort Timings Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kindergarten */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Kindergarten (Nursery–UKG)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Time</label>
              <input
                type="text"
                value={timings.kindergarten.start}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    kindergarten: { ...timings.kindergarten, start: e.target.value },
                  })
                }
                placeholder="08:30 AM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Time</label>
              <input
                type="text"
                value={timings.kindergarten.end}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    kindergarten: { ...timings.kindergarten, end: e.target.value },
                  })
                }
                placeholder="12:30 PM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Schedule Note</label>
            <input
              type="text"
              value={timings.kindergarten.description}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  kindergarten: { ...timings.kindergarten, description: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        {/* Primary School */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Primary School (Classes 1–5)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Time</label>
              <input
                type="text"
                value={timings.primary.start}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    primary: { ...timings.primary, start: e.target.value },
                  })
                }
                placeholder="08:00 AM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Time</label>
              <input
                type="text"
                value={timings.primary.end}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    primary: { ...timings.primary, end: e.target.value },
                  })
                }
                placeholder="02:00 PM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Schedule Note</label>
            <input
              type="text"
              value={timings.primary.description}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  primary: { ...timings.primary, description: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        {/* Secondary & Senior */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Middle & Senior (Classes 6–12)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Time</label>
              <input
                type="text"
                value={timings.secondary.start}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    secondary: { ...timings.secondary, start: e.target.value },
                  })
                }
                placeholder="07:45 AM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Time</label>
              <input
                type="text"
                value={timings.secondary.end}
                onChange={(e) =>
                  setTimings({
                    ...timings,
                    secondary: { ...timings.secondary, end: e.target.value },
                  })
                }
                placeholder="02:30 PM"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Schedule Note</label>
            <input
              type="text"
              value={timings.secondary.description}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  secondary: { ...timings.secondary, description: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

      </form>

      {/* Office Hours & Seasonal Shifts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Office Hours & Seasonal Adjustments
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Weekday Office Hours</label>
            <input
              type="text"
              value={timings.officeHours.weekdays}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  officeHours: { ...timings.officeHours, weekdays: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Saturday Office Hours</label>
            <input
              type="text"
              value={timings.officeHours.saturday}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  officeHours: { ...timings.officeHours, saturday: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sunday Status</label>
            <input
              type="text"
              value={timings.officeHours.sunday}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  officeHours: { ...timings.officeHours, sunday: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Summer Shift Description</label>
            <input
              type="text"
              value={timings.summerShift}
              onChange={(e) => setTimings({ ...timings, summerShift: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Winter Shift Description</label>
            <input
              type="text"
              value={timings.winterShift}
              onChange={(e) => setTimings({ ...timings, winterShift: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
