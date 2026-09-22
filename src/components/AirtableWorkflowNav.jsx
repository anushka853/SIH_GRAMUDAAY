import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const phases = [
  {
    id: 'phase1',
    step: '01',
    title: 'Phase 1: User Application & AI Discovery',
    sub: 'Multilingual feasibility, 10% margin input & peer pool',
    role: 'entrepreneur',
    accentColor: 'var(--emerald)',
    accentLight: 'var(--emerald-light)',
  },
  {
    id: 'phase2',
    step: '02',
    title: 'Phase 2: Bank Evaluation & AI Counter-Proposals',
    sub: 'Saturation density radar & 3 low-competition alternative ideas',
    role: 'bank',
    accentColor: 'var(--info)',
    accentLight: 'var(--info-light)',
  },
  {
    id: 'phase3',
    step: '03',
    title: 'Phase 3: Financial Router & Govt Scheme AI',
    sub: 'PMEGP, MUDRA, SCA Micro/Term Loan math algorithm',
    role: 'bank',
    accentColor: 'var(--accent)',
    accentLight: 'var(--accent-light)',
  },
  {
    id: 'phase4',
    step: '04',
    title: 'Phase 4: Admin Monitoring & Repayment Tracker',
    sub: 'District survival metrics & step-by-step EMI tracker',
    role: 'admin',
    accentColor: 'var(--warning)',
    accentLight: 'var(--warning-light)',
  },
];

export default function AirtableWorkflowNav({ activePhase, onPhaseChange }) {
  const { currentRole, switchRole } = useAuth();

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="page-eyebrow">Operational Workflow Navigator</span>
        </div>
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-600"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontWeight: 600 }}
        >
          Active: {currentRole.toUpperCase()}
        </span>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {phases.map((p) => {
          const isActive = activePhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                onPhaseChange(p.id);
                if (currentRole !== p.role) switchRole(p.role);
              }}
              className="text-left p-4 rounded-xl border transition-all"
              style={{
                background: isActive ? p.accentLight : 'var(--bg-elevated)',
                borderColor: isActive ? p.accentColor : 'var(--border-subtle)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-700 font-mono"
                  style={{ color: isActive ? p.accentColor : 'var(--text-muted)', fontWeight: 700 }}
                >
                  {p.step}
                </span>
                {isActive && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-600"
                    style={{ background: p.accentColor, color: 'white', fontWeight: 600 }}
                  >
                    Active
                  </span>
                )}
              </div>
              <p
                className="text-xs font-600 leading-snug"
                style={{ color: isActive ? p.accentColor : 'var(--text-primary)', fontWeight: 600 }}
              >
                {p.title}
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {p.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
