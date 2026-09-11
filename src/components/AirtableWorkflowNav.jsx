import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Calculator, Building2, ShieldCheck, Activity, ChevronRight, Sparkles } from 'lucide-react';

export default function AirtableWorkflowNav({ activePhase, onPhaseChange }) {
  const { currentRole, switchRole } = useAuth();
  const { t } = useLanguage();

  const phases = [
    {
      id: 'phase1',
      stepNumber: '01',
      title: t('phase1Title'),
      sub: t('phase1Sub'),
      role: 'entrepreneur',
      color: 'border-l-4 border-emerald-500 bg-emerald-50 text-emerald-900'
    },
    {
      id: 'phase2',
      stepNumber: '02',
      title: t('phase2Title'),
      sub: t('phase2Sub'),
      role: 'bank',
      color: 'border-l-4 border-blue-500 bg-blue-50 text-blue-900'
    },
    {
      id: 'phase3',
      stepNumber: '03',
      title: t('phase3Title'),
      sub: t('phase3Sub'),
      role: 'bank',
      color: 'border-l-4 border-purple-500 bg-purple-50 text-purple-900'
    },
    {
      id: 'phase4',
      stepNumber: '04',
      title: t('phase4Title'),
      sub: t('phase4Sub'),
      role: 'admin',
      color: 'border-l-4 border-amber-500 bg-amber-50 text-amber-900'
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Operational Workflow Phase Navigator
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Role: {currentRole.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {phases.map((p) => {
          const isActive = activePhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                onPhaseChange(p.id);
                if (currentRole !== p.role) {
                  switchRole(p.role);
                }
              }}
              className={`text-left p-4 rounded-2xl transition-all border cursor-pointer ${
                isActive
                  ? `${p.color} border-slate-300 shadow-md ring-2 ring-emerald-500/20`
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono font-black text-slate-400">
                  {p.stepNumber}
                </span>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold leading-tight line-clamp-1">{p.title}</h4>
              <p className="text-[11px] opacity-80 mt-1 line-clamp-2 leading-relaxed">{p.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
