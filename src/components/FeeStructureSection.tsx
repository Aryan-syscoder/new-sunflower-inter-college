import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowRight, HelpCircle, Check, Info } from 'lucide-react';
import { useSchool } from '../context/SchoolContext.tsx';
import { GradeCategory, GradeLevel, FeeItem } from '../types.ts';

interface FeeStructureSectionProps {
  onSelectGradeForApply: (grade: GradeLevel) => void;
}

export const FeeStructureSection: React.FC<FeeStructureSectionProps> = ({ onSelectGradeForApply }) => {
  const { schoolData } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const categories: { label: string; value: string }[] = [
    { label: 'All Classes', value: 'All' },
    { label: 'Kindergarten (Nursery–UKG)', value: 'Kindergarten' },
    { label: 'Primary (1–5)', value: 'Primary (1-5)' },
    { label: 'Middle (6–8)', value: 'Middle (6-8)' },
    { label: 'Secondary (9–10)', value: 'Secondary (9-10)' },
    { label: 'Senior Secondary (11–12)', value: 'Senior Secondary (11-12)' },
  ];

  const filteredFees = useMemo(() => {
    return schoolData.fees.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [schoolData.fees, selectedCategory, searchQuery]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="fees" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            04. Transparent Tuition & Dues
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Comprehensive Fee Structure (Nursery to 12th)
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            New Sunflower Inter College provides accessible, transparent fee schedules from Nursery through Class 12,
            including recognized Intermediate Science and Arts streams. Updated live from the College Administration desk.
          </p>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search class or stream..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                    viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* View Mode: Dynamic Table */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-5">Grade / Program</th>
                  <th className="py-4 px-4 text-right">One-Time Admission</th>
                  <th className="py-4 px-4 text-right">Tuition / Quarter</th>
                  <th className="py-4 px-4 text-right">Activity & Lab</th>
                  <th className="py-4 px-4 text-right">Annual Development</th>
                  <th className="py-4 px-4 text-right font-bold text-slate-900">Total Annual Dues</th>
                  <th className="py-4 px-4 text-center">Seat Status</th>
                  <th className="py-4 px-5 text-right">Admissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      <div>{fee.grade}</div>
                      <div className="text-[11px] font-normal text-slate-500">{fee.category}</div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(fee.admissionFee)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(fee.tuitionFeePerQuarter)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(fee.activityLabFee)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                      {formatCurrency(fee.developmentChargeAnnual)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums font-bold text-slate-900 text-sm sm:text-base">
                      {formatCurrency(fee.totalAnnualFee)}
                    </td>
                    <td className="py-4 px-4 text-center text-xs">
                      <span
                        className={`inline-block font-medium ${
                          fee.seatAvailability === 'Open'
                            ? 'text-emerald-700'
                            : fee.seatAvailability === 'Limited Seats'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {fee.seatAvailability}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => onSelectGradeForApply(fee.grade)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode: Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFees.map((fee) => (
              <div
                key={fee.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-900">{fee.grade}</h3>
                      <div className="text-xs text-slate-500">{fee.category}</div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        fee.seatAvailability === 'Open'
                          ? 'text-emerald-700'
                          : fee.seatAvailability === 'Limited Seats'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {fee.seatAvailability}
                    </span>
                  </div>

                  <div className="py-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>One-Time Admission:</span>
                      <span className="font-mono tabular-nums font-semibold">{formatCurrency(fee.admissionFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Quarterly Tuition (x4):</span>
                      <span className="font-mono tabular-nums font-semibold">{formatCurrency(fee.tuitionFeePerQuarter)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Lab & Activity:</span>
                      <span className="font-mono tabular-nums font-semibold">{formatCurrency(fee.activityLabFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Annual Dev Charge:</span>
                      <span className="font-mono tabular-nums font-semibold">{formatCurrency(fee.developmentChargeAnnual)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mb-4">
                    <div className="text-xs text-slate-500">Curricular Highlights:</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {fee.highlights.map((h, i) => (
                        <span key={i} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Total Annual</div>
                    <div className="text-lg font-serif font-bold text-slate-900 tabular-nums">
                      {formatCurrency(fee.totalAnnualFee)}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectGradeForApply(fee.grade)}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Database Notice */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong>Fee Guarantee & Live Sync:</strong> All figures above include textbook lending privileges, digital classroom access, and standard laboratory consumable charges. Any updates implemented by the school principal or owner in the Administrative Dashboard propagate live to this table immediately.
          </div>
        </div>

      </div>
    </section>
  );
};
