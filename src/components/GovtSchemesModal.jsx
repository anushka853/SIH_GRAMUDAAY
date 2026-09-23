import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/financialEngine';
import { X, Gift, CheckCircle2, ShieldCheck, ArrowRight, Landmark, Percent, Clock } from 'lucide-react';

export default function GovtSchemesModal({ isOpen, onClose }) {
  const { govtSchemes } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const schemesList = Object.values(govtSchemes || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-purple-600" /> Public Government Schemes Repository
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold px-3 py-1 rounded-full">
              {schemesList.length} Active Schemes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('publicSchemesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {t('publicSchemesSub')}
          </p>
        </div>

        {/* Schemes List Grid */}
        <div className="overflow-y-auto pr-2 space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemesList.map((scheme) => (
              <div
                key={scheme.key}
                className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {scheme.category || 'Government Credit'}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Max: {formatINR(scheme.maxProjectCost)}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-xs font-semibold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Interest Rate</span>
                    <span className="font-extrabold text-amber-600">{scheme.interestRate}% p.a.</span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Tenure / Grace</span>
                    <span className="font-extrabold text-blue-600">{scheme.tenureYears} Yrs / {scheme.moratoriumMonths}m</span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] block">Capital Subsidy</span>
                    <span className="font-extrabold text-purple-700">
                      {scheme.subsidyPercent > 0 ? `${scheme.subsidyPercent}% Grant` : 'Nil'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Official State Channelizing Agencies (SCAs) Guidelines</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-extrabold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
