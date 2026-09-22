import React from 'react';
import { ShieldCheck, Percent, Clock, Calendar, DollarSign, Gift } from 'lucide-react';
import { formatINR } from '../utils/financialEngine';

export default function SchemeBadge({ financial }) {
  if (!financial) return null;

  const hasSubsidy = financial.govtSubsidyAmount > 0;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-600 px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontWeight: 600 }}
              >
                {financial.schemeDetails?.category || 'Government Scheme'}
              </span>
              {hasSubsidy && (
                <span
                  className="text-xs font-600 px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontWeight: 600 }}
                >
                  <Gift className="w-3 h-3" />
                  {financial.subsidyPercent}% Govt Subsidy
                </span>
              )}
            </div>
            <h3
              className="text-base font-700 mt-1"
              style={{ color: 'var(--text-primary)', fontWeight: 700 }}
            >
              {financial.schemeName}
            </h3>
          </div>
        </div>
        <span
          className="text-sm font-600 px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontWeight: 600 }}
        >
          Project: {formatINR(financial.totalProjectCost)}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Percent,
            label: 'Interest Rate',
            value: `${financial.interestRate}% p.a.`,
            sub: 'Concessional',
            color: 'var(--warning)',
          },
          {
            icon: Clock,
            label: 'Tenure',
            value: `${financial.totalTenureYears} Years`,
            sub: `${financial.totalQuarters} Quarters`,
            color: 'var(--emerald)',
          },
          {
            icon: Calendar,
            label: 'Moratorium',
            value: `${financial.moratoriumMonths} Months`,
            sub: 'Grace Period',
            color: 'var(--info)',
          },
          {
            icon: DollarSign,
            label: 'Quarterly EMI',
            value: formatINR(financial.quarterlyEMI),
            sub: 'Post moratorium',
            color: 'var(--accent)',
          },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="p-3.5 rounded-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <div className="text-base font-700" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Subsidy banner */}
      {hasSubsidy && (
        <div
          className="mt-3 p-3 rounded-xl flex items-center justify-between text-sm"
          style={{ background: 'var(--warning-light)', border: '1px solid #FDE68A' }}
        >
          <span className="flex items-center gap-2 font-500" style={{ color: 'var(--warning)' }}>
            <Gift className="w-4 h-4" />
            Total Government Capital Subsidy Saved
          </span>
          <span className="font-700" style={{ color: 'var(--warning)', fontWeight: 700 }}>
            {formatINR(financial.govtSubsidyAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
