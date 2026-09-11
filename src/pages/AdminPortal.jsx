import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ADMIN_REGIONAL_METRICS } from '../utils/mockData';
import { formatINR } from '../utils/financialEngine';
import {
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
  Users,
  Activity,
  Award,
  PieChart as PieChartIcon,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function AdminPortal() {
  const { t, speak } = useLanguage();

  const pieData = [
    { name: 'Micro Finance Scheme (≤ ₹1.40L)', value: ADMIN_REGIONAL_METRICS.microFinanceSharePercent, color: '#10b981' },
    { name: 'Term Loan & Govt Subsidy Schemes', value: ADMIN_REGIONAL_METRICS.termLoanSharePercent, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header Banner - Airtable Style */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Master Government Portal
            </span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-extrabold px-3 py-1 rounded-full">
              Phase 4: System Admin Monitoring
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            System Admin Regional Enterprise & Fund Distribution Master Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Monitor national rural enterprise survival rates, concessional credit scheme distributions across districts, platform security audit trails, and saturation risk heatmaps.
          </p>
        </div>

        <button
          onClick={() => speak(`System Admin Master Dashboard loaded. Overall regional enterprise success rate is ${ADMIN_REGIONAL_METRICS.overallSuccessRatePercent} percent across ${ADMIN_REGIONAL_METRICS.activeMicroEnterprises} active units.`)}
          className="px-4 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-extrabold flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-amber-500" /> Audio Briefing
        </button>
      </div>

      {/* Top Metric Cards - Spacious Airtable Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Micro-Enterprises</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {ADMIN_REGIONAL_METRICS.activeMicroEnterprises.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Out of {ADMIN_REGIONAL_METRICS.totalEntrepreneursRegistered.toLocaleString()} registered</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Regional Success Rate</span>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {ADMIN_REGIONAL_METRICS.overallSuccessRatePercent}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">AI-assisted enterprise survival</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">10% Margin Equity</span>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {formatINR(ADMIN_REGIONAL_METRICS.totalMarginMobilized)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Beneficiary self-contribution</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">90% Govt Loan Sanctioned</span>
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-300 mt-2">
            {formatINR(ADMIN_REGIONAL_METRICS.totalLoanSanctioned)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Disbursed by SCA Agencies</p>
        </div>

      </div>

      {/* Scheme Fund Allocation Pie & Bar Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-emerald-500" />
            Government Scheme Allocation Share
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            District Enterprise Success Comparison
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_REGIONAL_METRICS.districtRankings}>
                <XAxis dataKey="district" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff' }} />
                <Bar dataKey="successRate" name="Success Rate %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* District Rankings Table - Airtable Status Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            District-Level SCA Enterprise Performance Table
          </h3>
          <span className="text-xs text-slate-400 font-semibold">5 Key Target Districts</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">District & State</th>
                <th className="px-4 py-3">Active Units</th>
                <th className="px-4 py-3">Success Rate</th>
                <th className="px-4 py-3">Fund Disbursed</th>
                <th className="px-4 py-3">Saturation Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {ADMIN_REGIONAL_METRICS.districtRankings.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-200">{d.district}</td>
                  <td className="px-4 py-3 font-mono">{d.activeUnits.toLocaleString()}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-600 dark:text-emerald-400">{d.successRate}%</td>
                  <td className="px-4 py-3 font-extrabold text-cyan-600 dark:text-cyan-400">{d.fundDisbursed}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        d.saturationRisk.includes('High')
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : d.saturationRisk.includes('Medium')
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
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

      {/* Security & Audit Logs Banner */}
      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Platform Fraud Prevention & Audit Trail</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              256-bit encrypted log integrity | 0 unverified broker transactions detected
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 rounded-xl text-xs font-extrabold flex items-center gap-2">
          <Download className="w-4 h-4" /> Download National Audit Log (PDF)
        </button>
      </div>

    </div>
  );
}

