import React, { useState } from 'react';
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
  Download,
  PlusCircle,
  Gift
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function AdminPortal() {
  const { addGovtScheme } = useAuth();
  const { t, speak } = useLanguage();

  const [showSchemeForm, setShowSchemeForm] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [category, setCategory] = useState('Central Capital Subsidy');
  const [maxCost, setMaxCost] = useState(1500000);
  const [interestRate, setInterestRate] = useState(6.0);
  const [tenureYears, setTenureYears] = useState(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);
  const [subsidyPercent, setSubsidyPercent] = useState(25);
  const [description, setDescription] = useState('');
  const [schemeAddedSuccess, setSchemeAddedSuccess] = useState(false);

  const handleAddScheme = (e) => {
    e.preventDefault();
    if (!schemeName.trim()) return;
    const newScheme = {
      key: `SCHEME_${Date.now().toString().slice(-6)}`,
      name: schemeName,
      category,
      maxProjectCost: Number(maxCost),
      interestRate: Number(interestRate),
      tenureYears: Number(tenureYears),
      moratoriumMonths: Number(moratoriumMonths),
      subsidyPercent: Number(subsidyPercent),
      description: description || `${schemeName} for rural enterprise support.`
    };
    addGovtScheme(newScheme);
    setSchemeAddedSuccess(true);
    speak(`New government scheme ${schemeName} successfully added to GramUday AI system database.`);
    setTimeout(() => {
      setSchemeAddedSuccess(false);
      setShowSchemeForm(false);
      setSchemeName('');
      setDescription('');
    }, 2000);
  };

  const pieData = [
    { name: 'Micro Finance Scheme (≤ ₹1.40L)', value: ADMIN_REGIONAL_METRICS.microFinanceSharePercent, color: '#059669' },
    { name: 'Term Loan & Govt Subsidy Schemes', value: ADMIN_REGIONAL_METRICS.termLoanSharePercent, color: '#2563eb' }
  ];

  return (
    <div className="space-y-8 pb-16 text-slate-900">
      
      {/* Top Header Banner - Crisp Light Theme */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Master Government Portal
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full">
              Phase 4: System Admin Monitoring & Management
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('adminDashboardTitle')}
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
            {t('adminDashboardSub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSchemeForm(!showSchemeForm)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>{showSchemeForm ? t('closeSchemeFormBtn') : t('addNewSchemeBtn')}</span>
          </button>

          <button
            onClick={() => speak(`System Admin Master Dashboard loaded. Overall regional enterprise success rate is ${ADMIN_REGIONAL_METRICS.overallSuccessRatePercent} percent across ${ADMIN_REGIONAL_METRICS.activeMicroEnterprises} active units.`)}
            className="px-4 py-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-amber-600" /> Audio Briefing
          </button>
        </div>
      </div>

      {/* Admin Power Form: Add New Government Scheme */}
      {showSchemeForm && (
        <form onSubmit={handleAddScheme} className="bg-white border border-amber-300 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md text-slate-900">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                <Gift className="w-3.5 h-3.5 text-amber-600" /> Admin Privilege
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Register New Official Government Scheme
              </h3>
            </div>
            {schemeAddedSuccess && (
              <span className="text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Scheme Published System-Wide!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('schemeNameLabel')}</label>
              <input
                type="text"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                required
                placeholder="e.g. PM Vishwakarma Artisan Subsidy Scheme"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="Central Capital Subsidy">Central Capital Subsidy</option>
                <option value="Concessional Credit">Concessional Credit</option>
                <option value="Interest Subvention">Interest Subvention</option>
                <option value="Renewable Subsidy">Renewable Subsidy</option>
                <option value="Artisan Concession">Artisan Concession</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Project Cost (₹)</label>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tenure Years / Moratorium Months</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  placeholder="Tenure (Yrs)"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
                <input
                  type="number"
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(e.target.value)}
                  placeholder="Grace (Mths)"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capital Subsidy (%)</label>
              <input
                type="number"
                value={subsidyPercent}
                onChange={(e) => setSubsidyPercent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Objectives & Eligibility Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe eligibility criteria, target artisans, and financial benefit guidelines..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('publishSchemeBtn')}</span>
          </button>
        </form>
      )}

      {/* Top Metric Cards - Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Micro-Enterprises</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">
            {ADMIN_REGIONAL_METRICS.activeMicroEnterprises.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Out of {ADMIN_REGIONAL_METRICS.totalEntrepreneursRegistered.toLocaleString()} registered</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Regional Success Rate</span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-700 mt-2">
            {ADMIN_REGIONAL_METRICS.overallSuccessRatePercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">AI-assisted enterprise survival</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">10% Margin Equity</span>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {formatINR(ADMIN_REGIONAL_METRICS.totalMarginMobilized)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Beneficiary self-contribution</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">90% Govt Loan Sanctioned</span>
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">
            {formatINR(ADMIN_REGIONAL_METRICS.totalLoanSanctioned)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disbursed by SCA Agencies</p>
        </div>

      </div>

      {/* Scheme Fund Allocation Pie & Bar Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            District Enterprise Success Comparison
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_REGIONAL_METRICS.districtRankings}>
                <XAxis dataKey="district" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
                <Bar dataKey="successRate" name="Success Rate %" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* District Rankings Table */}
      <div className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            District-Level SCA Enterprise Performance Table
          </h3>
          <span className="text-xs text-slate-400 font-semibold">5 Key Target Districts</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">District & State</th>
                <th className="px-4 py-3">Active Units</th>
                <th className="px-4 py-3">Success Rate</th>
                <th className="px-4 py-3">Fund Disbursed</th>
                <th className="px-4 py-3">Saturation Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ADMIN_REGIONAL_METRICS.districtRankings.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{d.district}</td>
                  <td className="px-4 py-3 font-mono">{d.activeUnits.toLocaleString()}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-700">{d.successRate}%</td>
                  <td className="px-4 py-3 font-extrabold text-blue-700">{d.fundDisbursed}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        d.saturationRisk.includes('High')
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : d.saturationRisk.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
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
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Platform Fraud Prevention & Audit Trail</h4>
            <p className="text-xs text-slate-500">
              256-bit encrypted log integrity | 0 unverified broker transactions detected
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-sm">
          <Download className="w-4 h-4" /> Download National Audit Log (PDF)
        </button>
      </div>

    </div>
  );
}
