import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ADMIN_REGIONAL_METRICS } from '../utils/mockData';
import { formatINR } from '../utils/financialEngine';
import {
  Building2,
  TrendingUp,
  Users,
  Activity,
  Download,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderColor: 'var(--border-default)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontSize: '12px',
  boxShadow: 'var(--shadow-md)',
};

function MetricCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="metric-label">{label}</div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="metric-value" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function AdminPortal() {
  const { t, speak } = useLanguage();

  const pieData = [
    { name: t('admin.microFinanceScheme') || 'Micro Finance Scheme (≤ ₹1.40L)', value: ADMIN_REGIONAL_METRICS.microFinanceSharePercent, color: '#059669' },
    { name: t('admin.termLoanScheme') || 'Term Loan & Govt Subsidy Schemes', value: ADMIN_REGIONAL_METRICS.termLoanSharePercent, color: '#2563EB' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow mb-2">{t('admin.pageEyebrow') || 'System Admin — Phase 4 Monitoring'}</p>
          <h1 className="page-title">{t('admin.nationalIntelligence') || 'National Enterprise Intelligence'}</h1>
          <p className="page-subtitle mt-2 max-w-2xl">
            {t('admin.pageSubtitle') || 'Monitor rural enterprise activity, funding distribution, district performance, and system-wide metrics.'}
          </p>
        </div>
        <button
          onClick={() =>
            speak(
              `System Admin Master Dashboard. Enterprise success rate is ${ADMIN_REGIONAL_METRICS.overallSuccessRatePercent} percent across ${ADMIN_REGIONAL_METRICS.activeMicroEnterprises} active units.`
            )
          }
          className="btn-secondary text-sm self-start sm:self-auto flex items-center gap-2"
        >
          <Activity className="w-4 h-4" style={{ color: 'var(--warning)' }} />
          {t('admin.audioBriefing') || 'Audio Briefing'}
        </button>
      </div>

      {/* ─── Top Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t('admin.activeEnterprises') || 'Active Micro-Enterprises'}
          value={ADMIN_REGIONAL_METRICS.activeMicroEnterprises.toLocaleString()}
          sub={`${t('common.of') || 'of'} ${ADMIN_REGIONAL_METRICS.totalEntrepreneursRegistered.toLocaleString()} ${t('admin.registered') || 'registered'}`}
          icon={Users}
          color="var(--emerald)"
        />
        <MetricCard
          label={t('admin.regionalSuccessRate') || 'Regional Success Rate'}
          value={`${ADMIN_REGIONAL_METRICS.overallSuccessRatePercent}%`}
          sub={t('admin.aiSurvival') || 'AI-assisted enterprise survival'}
          icon={TrendingUp}
          color="var(--info)"
        />
        <MetricCard
          label={t('admin.marginMobilized') || 'Margin Equity Mobilized'}
          value={formatINR(ADMIN_REGIONAL_METRICS.totalMarginMobilized)}
          sub={t('admin.beneficiaryContribution') || 'Beneficiary self-contribution'}
          icon={Activity}
          color="var(--warning)"
        />
        <MetricCard
          label={t('admin.loanSanctioned') || 'Govt Loan Sanctioned'}
          value={formatINR(ADMIN_REGIONAL_METRICS.totalLoanSanctioned)}
          sub={t('admin.disbursedBySCA') || 'Disbursed by SCA Agencies'}
          icon={Building2}
          color="var(--accent)"
        />
      </div>

      {/* ─── Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
        >
          <h3
            className="text-base font-700 mb-1"
            style={{ color: 'var(--text-primary)', fontWeight: 700 }}
          >
            {t('admin.schemeAllocation') || 'Scheme Allocation Share'}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('admin.schemeAllocationDesc') || 'Distribution between Micro Finance and Term Loan schemes'}
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2 mt-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span>{item.name}</span>
                <span className="ml-auto font-600" style={{ color: item.color, fontWeight: 600 }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
        >
          <h3
            className="text-base font-700 mb-1"
            style={{ color: 'var(--text-primary)', fontWeight: 700 }}
          >
            {t('admin.districtSuccess') || 'District Enterprise Success'}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('admin.districtSuccessDesc') || 'Success rate comparison across key target districts'}
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_REGIONAL_METRICS.districtRankings} barSize={28}>
                <XAxis dataKey="district" stroke="#9A9A9A" fontSize={11} />
                <YAxis stroke="#9A9A9A" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [`${v}%`, t('admin.successRate') || 'Success Rate']}
                />
                <Bar dataKey="successRate" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── District Table ─── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
      >
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 className="text-base font-700" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {t('admin.districtPerformance') || 'District-Level SCA Performance'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('admin.targetDistricts') || '5 key target districts'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}>
              <tr>
                {[
                  t('admin.tableDistrict') || 'District',
                  t('admin.tableActiveUnits') || 'Active Units',
                  t('admin.tableSuccessRate') || 'Success Rate',
                  t('admin.tableFundDisbursed') || 'Fund Disbursed',
                  t('admin.tableSaturationRisk') || 'Saturation Risk'
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-3 text-xs font-600 uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)', fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_REGIONAL_METRICS.districtRankings.map((d, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-3.5 font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {d.district}
                  </td>
                  <td className="px-5 py-3.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {d.activeUnits.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-700" style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                    {d.successRate}%
                  </td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--info)', fontWeight: 600 }}>
                    {d.fundDisbursed}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="badge"
                      style={
                        d.saturationRisk.includes('High')
                          ? { background: 'var(--danger-light)', color: 'var(--danger)' }
                          : d.saturationRisk.includes('Medium')
                          ? { background: 'var(--warning-light)', color: 'var(--warning)' }
                          : { background: 'var(--emerald-light)', color: 'var(--emerald)' }
                      }
                    >
                      {d.saturationRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Security Footer ─── */}
      <div
        className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}
          >
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {t('admin.securityTitle') || 'Platform Fraud Prevention & Audit Trail'}
            </h4>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('admin.securityDesc') || '256-bit encrypted log integrity · 0 unverified broker transactions detected'}
            </p>
          </div>
        </div>
        <button className="btn-secondary text-sm flex items-center gap-2 flex-shrink-0">
          <Download className="w-4 h-4" />
          {t('admin.downloadLog') || 'Download Audit Log (PDF)'}
        </button>
      </div>
    </div>
  );
}
