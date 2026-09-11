import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calculator, Building2, ShieldCheck, Activity, ChevronRight, Sparkles } from 'lucide-react';

export default function AirtableWorkflowNav({ activePhase, onPhaseChange }) {
  const { currentRole, switchRole } = useAuth();

  const phases = [
    {
      id: 'phase1',
      stepNumber: '01',
      title: 'Phase 1: User Application & AI Discovery',
      sub: 'Multilingual feasibility, 10% margin input & peer pool',
      role: 'entrepreneur',
      color: 'border-l-4 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
    },
    {
      id: 'phase2',
      stepNumber: '02',
      title: 'Phase 2: Bank Evaluation & AI Counter-Proposals',
      sub: 'Saturation density radar & 3 low-competition alternative ideas',
      role: 'bank',
      color: 'border-l-4 border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
    },
    {
      id: 'phase3',
      stepNumber: '03',
      title: 'Phase 3: Financial Router & Govt Scheme AI',
      sub: 'PMEGP, MUDRA, SCA Micro/Term Loan math algorithm',
      role: 'bank',
      color: 'border-l-4 border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300'
    },
    {
      id: 'phase4',
      stepNumber: '04',
      title: 'Phase 4: Admin Monitoring & Repayment Tracker',
      sub: 'District survival metrics & step-by-step EMI tracker',
      role: 'admin',
      color: 'border-l-4 border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Airtable Operational Workflow Nav
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Active Role: {currentRole.toUpperCase()}
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
              className={`text-left p-4 rounded-2xl transition-all border ${
                isActive
                  ? `${p.color} border-slate-300 dark:border-slate-700 shadow-md ring-2 ring-emerald-500/20`
                  : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                  {p.stepNumber}
                </span>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold leading-tight line-clamp-1">{p.title}</h4>
              <p className="text-[11px] opacity-75 mt-1 line-clamp-2 leading-relaxed">{p.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
