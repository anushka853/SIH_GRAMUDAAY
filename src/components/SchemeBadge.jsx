import React from 'react';
import { ShieldCheck, Percent, Clock, Calendar, DollarSign, Gift } from 'lucide-react';
import { formatINR } from '../utils/financialEngine';

export default function SchemeBadge({ financial }) {
  if (!financial) return null;

  const hasSubsidy = financial.govtSubsidyAmount > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden transition-all text-slate-100">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {financial.schemeDetails?.category || 'Government Scheme'}
              </span>
              {hasSubsidy && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-amber-400" /> {financial.subsidyPercent}% Govt Subsidy
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-100 mt-1">
              {financial.schemeName}
            </h3>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-slate-950 text-emerald-400 border border-slate-800 shadow-sm">
          Project Cost: {formatINR(financial.totalProjectCost)}
        </span>
      </div>

      {/* Grid Specs Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <span>Concessional Rate</span>
          </div>
          <div className="text-lg font-black text-amber-400">{financial.interestRate}% p.a.</div>
          <div className="text-[10px] text-slate-500">Government Subsidized</div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Repayment Tenure</span>
          </div>
          <div className="text-lg font-black text-emerald-400">{financial.totalTenureYears} Years</div>
          <div className="text-[10px] text-slate-500">{financial.totalQuarters} Quarters</div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-cyan-500" />
            <span>Moratorium Period</span>
          </div>
          <div className="text-lg font-black text-cyan-400">{financial.moratoriumMonths} Months</div>
          <div className="text-[10px] text-slate-500">Principal Grace Period</div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-purple-500" />
            <span>Quarterly EMI</span>
          </div>
          <div className="text-lg font-black text-purple-300">{formatINR(financial.quarterlyEMI)}</div>
          <div className="text-[10px] text-slate-500">Post Moratorium</div>
        </div>
      </div>

      {/* Subsidy banner */}
      {hasSubsidy && (
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-500" /> Total Direct Government Capital Subsidy Saved:
          </span>
          <span className="font-black text-amber-400 text-sm">
            {formatINR(financial.govtSubsidyAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
