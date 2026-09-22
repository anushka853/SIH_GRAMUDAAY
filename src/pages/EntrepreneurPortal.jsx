import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from '../components/VoiceButton';
import SchemeBadge from '../components/SchemeBadge';
import { generateFeasibilityReport } from '../utils/aiFeasibilityEngine';
import { formatINR, PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';
import { SECTIONS_PRESETS, REGIONS_PRESETS } from '../utils/mockData';
import {
  Sparkles,
  Calculator,
  TrendingUp,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  ArrowRight,
  Activity,
  DollarSign,
  Briefcase,
  HeartHandshake,
  Gift,
  Volume2,
  LayoutDashboard,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: '0.375rem',
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  padding: '0.625rem 0.875rem',
  fontSize: '0.9375rem',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 150ms ease',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
};

function MetricCard({ label, value, sub, color }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
    >
      <div className="metric-label mb-2">{label}</div>
      <div className="metric-value" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function EntrepreneurPortal({ activePage }) {
  const { currentUser, submitApplication, applications } = useAuth();
  const { t, speak } = useLanguage();

  const [marginCapital, setMarginCapital] = useState('');
  const [businessIdea, setBusinessIdea] = useState('');
  const [sectorKey, setSectorKey] = useState('Dairy');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState(0);
  const [chosenSchemeKey, setChosenSchemeKey] = useState('SCA_MICRO');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [report, setReport] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Sync sidebar navigation with internal tabs
  React.useEffect(() => {
    if (['assessment', 'my-applications', 'dashboard'].includes(activePage)) {
      setActiveTab('dashboard');
    } else if (['feasibility', 'financial-structuring', 'loan-recommendation', 'schemes'].includes(activePage)) {
      setActiveTab('feasibility');
    } else if (['repayment-plan', 'funding-status'].includes(activePage)) {
      setActiveTab('repayment');
    }
  }, [activePage]);

  // Pre-fill mock data if user has an active application
  const userApp = applications.find((a) => a.applicantName === currentUser?.name);

  React.useEffect(() => {
    if (userApp && !report && !isGenerating) {
      setMarginCapital(userApp.availableMarginCapital.toString());
      setBusinessIdea(userApp.originalBusinessIdea);
      setSectorKey(userApp.sectorKey);
      setChosenSchemeKey(userApp.feasibilityReport.financial.schemeType || 'SCA_TERM');
      setReport(userApp.feasibilityReport);
      setApplicationSubmitted(true);
    }
  }, [userApp, report, isGenerating]);

  const handleGenerate = (e) => {
    if (e) e.preventDefault();

    if (!marginCapital || Number(marginCapital) < 10000) {
      alert(t('error.marginCapital') || 'Please enter a valid margin capital (minimum ₹10,000)');
      return;
    }
    if (!businessIdea.trim()) {
      alert(t('error.businessIdea') || 'Please enter a business idea');
      return;
    }

    setIsGenerating(true);
    setReport(null);
    setApplicationSubmitted(false);

    const steps = [
      'Analyzing location...',
      'Evaluating market opportunity...',
      'Mapping competition...',
      'Assessing business risks...',
      'Structuring financial options...'
    ];
    
    let step = 0;
    setLoadingMessage(steps[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setLoadingMessage(steps[step]);
      } else {
        clearInterval(interval);
        
        const region = REGIONS_PRESETS[selectedRegionIndex];
        const generated = generateFeasibilityReport({
          location: region,
          marginCapital: Number(marginCapital),
          businessIdea,
          sectorKey,
          chosenSchemeKey,
        });
        
        setReport(generated);
        setIsGenerating(false);

        speak(
          `AI Feasibility Report generated for ${businessIdea} in ${region.village}. Total project cost is ${formatINR(
            generated.financial.totalProjectCost
          )}, requiring ${formatINR(generated.financial.marginCapital)} margin money. Loan eligible under ${
            generated.financial.schemeName
          } is ${formatINR(generated.financial.sanctionedLoan)}.`
        );
      }
    }, 600); // 600ms per step for snappy demo
  };

  const handleApply = () => {
    if (!report) return;
    const newApp = {
      id: `GRM-${Math.floor(1000 + Math.random() * 9000)}`, // using GRM format for demo
      applicantName: currentUser?.name,
      age: currentUser?.age,
      contact: currentUser?.contact,
      address: currentUser?.address,
      location: report.rawLocation,
      originalBusinessIdea: report.businessIdea,
      sectorKey,
      availableMarginCapital: report.financial.marginCapital,
      status: report.competitorMapping.isOversaturated ? 'COUNTER_PROPOSED' : 'PENDING',
      appliedAt: new Date().toISOString(),
      feasibilityReport: report,
    };
    submitApplication(newApp);
    setApplicationSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow mb-2">{t('nav.feasibility')}</p>
          <h1 className="page-title">
            {t('entrepreneur.pageTitleStart') || 'Turn your business idea'}<br className="hidden sm:block" /> {t('entrepreneur.pageTitleEnd') || 'into a viable enterprise.'}
          </h1>
          <p className="page-subtitle mt-2 max-w-2xl">
            {t('entrepreneur.pageSubtitle') || 'Get AI-powered market feasibility analysis, government scheme routing, and loan calculation tailored to your village.'}
          </p>
        </div>
        {/* Tab Switcher */}
        <div
          className="flex p-1 rounded-xl self-start sm:self-auto"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'feasibility', label: t('nav.feasibility'), icon: Calculator },
            { id: 'repayment', label: t('entrepreneur.repaymentTracker') || 'Repayment', icon: Activity },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: activeTab === id ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === id ? 600 : 400,
                boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Dashboard Tab ─── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 fade-in">
          {userApp ? (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{userApp.originalBusinessIdea}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{userApp.location.villageName}, {userApp.location.districtName}, {userApp.location.stateName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-warning-50 text-warning-700 border border-warning-200">
                  {userApp.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Margin Capital</div>
                  <div className="text-lg font-bold text-[var(--text-primary)]">{formatINR(userApp.availableMarginCapital)}</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Project Cost</div>
                  <div className="text-lg font-bold text-[var(--emerald)]">{formatINR(userApp.feasibilityReport.financial.totalProjectCost)}</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Loan Requirement</div>
                  <div className="text-lg font-bold text-[var(--info)]">{formatINR(userApp.feasibilityReport.financial.sanctionedLoan)}</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Feasibility</div>
                  <div className="text-lg font-bold text-[var(--accent)]">{userApp.feasibilityReport.feasibilitySummary.overallScore} / 100</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[var(--emerald-light)] border border-emerald-200 mb-6">
                <h3 className="text-sm font-bold text-emerald-800 mb-2">Recommended Scheme: {userApp.feasibilityReport.financial.schemeName}</h3>
                <div className="flex gap-4 text-xs text-emerald-700">
                  <span>Interest: {userApp.feasibilityReport.financial.interestRate}%</span>
                  <span>Tenure: {userApp.feasibilityReport.financial.tenureYears} Years</span>
                  <span>Moratorium: {userApp.feasibilityReport.financial.moratoriumMonths} Months</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setActiveTab('feasibility')} className="btn-primary px-4 py-2 text-sm">
                  View Full Feasibility Report
                </button>
                <button onClick={() => setActiveTab('repayment')} className="btn-secondary px-4 py-2 text-sm">
                  View Financial Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
              <LayoutDashboard className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No Active Application</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                You haven't generated a feasibility report or submitted a loan application yet. Head over to the Feasibility tab to get started.
              </p>
              <button onClick={() => setActiveTab('feasibility')} className="btn-primary px-6 py-2">
                Generate Feasibility Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Feasibility Tab ─── */}
      {activeTab === 'feasibility' && (
        <>
          {/* Input Form */}
          <form
            onSubmit={handleGenerate}
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
          >
            <div className="pb-4 mb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 className="text-lg font-700" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                {t('entrepreneur.businessInfo')}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {t('entrepreneur.businessInfoSubtitle') || 'Provide your location, margin capital, and proposed business to generate an AI feasibility report.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Location */}
              <div>
                <label style={labelStyle} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5">STEP 1</span>
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--emerald)' }} />
                  {t('entrepreneur.locationLabel')}
                </label>
                <div className="relative">
                  <select
                    value={selectedRegionIndex}
                    onChange={(e) => setSelectedRegionIndex(Number(e.target.value))}
                    style={selectStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                  >
                    {REGIONS_PRESETS.map((r, idx) => (
                      <option key={idx} value={idx}>
                        {r.village}, {r.block} ({r.district}, {r.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Margin Capital */}
              <div>
                <label style={labelStyle} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5">STEP 3</span>
                  <DollarSign className="w-3.5 h-3.5" style={{ color: 'var(--warning)' }} />
                  {t('entrepreneur.marginCapitalLabel')}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-600"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      step="5000"
                      min="10000"
                      max="500000"
                      value={marginCapital}
                      onChange={(e) => setMarginCapital(e.target.value)}
                      placeholder={t('entrepreneur.marginCapitalPlaceholder')}
                      style={{ ...inputStyle, paddingLeft: '2rem', fontWeight: 600, color: 'var(--emerald)' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                  <VoiceButton onTranscript={(txt) => setMarginCapital(txt.replace(/[^0-9]/g, ''))} />
                </div>
              </div>

              {/* Business Sector */}
              <div>
                <label style={labelStyle} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5">STEP 2</span>
                  <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--info)' }} />
                  {t('entrepreneur.businessIdeaLabel')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={sectorKey}
                    onChange={(e) => {
                      setSectorKey(e.target.value);
                      const sec = SECTIONS_PRESETS.find((s) => s.key === e.target.value);
                      if (sec) setBusinessIdea(`${sec.label} Unit`);
                    }}
                    style={{ ...selectStyle, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                  >
                    {SECTIONS_PRESETS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <VoiceButton onTranscript={(txt) => setBusinessIdea(txt)} />
                </div>
              </div>
            </div>

            {/* Government Scheme Selector */}
            <div className="mt-5">
              <label style={labelStyle} className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                {t('entrepreneur.selectScheme') || 'Select Government Scheme'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.keys(PREDEFINED_GOVT_SCHEMES).map((key) => {
                  const s = PREDEFINED_GOVT_SCHEMES[key];
                  const isSelected = chosenSchemeKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setChosenSchemeKey(key)}
                      className="p-3 rounded-xl border text-left transition-all"
                      style={{
                        background: isSelected ? 'var(--text-primary)' : 'var(--bg-elevated)',
                        borderColor: isSelected ? 'var(--text-primary)' : 'var(--border-subtle)',
                        color: isSelected ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      <span
                        className="text-xs block mb-0.5"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', fontSize: '0.6875rem' }}
                      >
                        {s.category}
                      </span>
                      <span className="text-xs font-600 block leading-tight" style={{ fontWeight: 600 }}>
                        {s.name}
                      </span>
                      <span
                        className="text-xs font-600 block mt-1"
                        style={{ color: isSelected ? '#6EE7B7' : 'var(--emerald)', fontWeight: 600 }}
                      >
                        {s.subsidyPercent > 0 ? `${s.subsidyPercent}% Subsidy` : `${s.interestRate}% Rate`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary w-full mt-6 text-base"
              style={{ borderRadius: 'var(--radius-lg)', padding: '0.875rem', opacity: isGenerating ? 0.7 : 1 }}
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? loadingMessage : t('entrepreneur.generateReport')}
            </button>
          </form>

          {/* ─── Report Output ─── */}
          {report && (
            <div className="space-y-5 fade-in">
              {/* STEP 4: Feasibility Report */}
              <div
                className="rounded-xl p-6 space-y-6"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
              >
                <div className="pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5 mb-2 inline-block">STEP 4</span>
                  <h2 className="text-xl font-700" style={{ color: 'var(--text-primary)' }}>Hyper-Local Feasibility Report</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Generated for: {report.businessIdea} at {report.location}</p>
                </div>
                {/* Market Saturation Warning */}
                {report.competitorMapping.isOversaturated && (
                  <div
                    className="p-4 rounded-xl flex items-start gap-3"
                    style={{ background: 'var(--warning-light)', border: '1px solid #FDE68A' }}
                  >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                    <div>
                      <h4 className="text-sm font-600" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                        {t('entrepreneur.highMarketSaturation') || 'High Market Saturation'} ({report.competitorMapping.existingSimilarUnits} {t('entrepreneur.existingUnits') || 'Existing Units'})
                      </h4>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {t('entrepreneur.marketSaturationDesc') || `The AI Market Radar flagged high competitor density in ${report.rawLocation.blockName}. An AI Counter-Proposal in the Bank Portal will suggest 3 higher-profit, low-competition alternatives.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2-column modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Market Reach */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="text-sm font-600 flex items-center gap-2 mb-3" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <MapPin className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                      {t('entrepreneur.marketReachTitle') || 'Market Reach & Demographics'}
                      <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full font-600"
                        style={{ background: 'var(--emerald-light)', color: 'var(--emerald)', fontWeight: 600 }}
                      >
                        {report.marketReach.radiusKm} km
                      </span>
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {report.marketReach.targetDemographics}
                    </p>
                    <div className="flex justify-between text-xs pt-3" style={{ borderTop: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                      <span>{t('entrepreneur.estimatedConsumerBase') || 'Estimated Consumer Base'}</span>
                      <span className="font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {report.marketReach.consumerBaseEstimate.toLocaleString()} {t('entrepreneur.residents') || 'residents'}
                      </span>
                    </div>
                  </div>

                  {/* Opportunity Analysis */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="text-sm font-600 flex items-center gap-2 mb-3" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <TrendingUp className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                      {t('entrepreneur.opportunityTitle') || 'Opportunity Analysis'}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {report.opportunityAnalysis.marketGaps}
                    </p>
                    <div className="pt-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                      <span className="text-xs font-600 block mb-2" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                        {t('entrepreneur.underservedNiches') || 'Underserved Niches'}
                      </span>
                      <ul className="space-y-1">
                        {report.opportunityAnalysis.underservedNiches.map((n, i) => (
                          <li key={i} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--warning)' }} />
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SWOT */}
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <h3 className="text-sm font-600 flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    <PieChart className="w-4 h-4" style={{ color: 'var(--info)' }} />
                    {t('entrepreneur.swot')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'strengths', label: t('entrepreneur.strengths'), data: report.swot.strengths, color: 'var(--emerald)', bg: 'var(--emerald-light)' },
                      { key: 'weaknesses', label: t('entrepreneur.weaknesses'), data: report.swot.weaknesses, color: 'var(--danger)', bg: 'var(--danger-light)' },
                      { key: 'opportunities', label: t('entrepreneur.opportunities'), data: report.swot.opportunities, color: 'var(--info)', bg: 'var(--info-light)' },
                      { key: 'threats', label: t('entrepreneur.threats'), data: report.swot.threats, color: 'var(--warning)', bg: 'var(--warning-light)' },
                    ].map(({ key, label, data, color, bg }) => (
                      <div key={key} className="p-3.5 rounded-xl" style={{ background: bg, border: `1px solid ${color}30` }}>
                        <span className="text-xs font-700 block mb-2" style={{ color, fontWeight: 700 }}>{label}</span>
                        <ul className="space-y-1">
                          {data.map((item, i) => (
                            <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Threats & Competitor Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Module 4: Threats Identification */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="text-sm font-600 flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <AlertTriangle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                      Local Threat Identification
                    </h3>
                    <div className="space-y-3">
                      {report.threatsMatrix.map((threat, idx) => (
                        <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-700" style={{ color: 'var(--text-primary)' }}>{threat.threat}</span>
                            <span className="text-[10px] font-700 px-2 py-0.5 rounded-full" style={{ background: threat.riskLevel === 'High' ? 'var(--danger-light)' : 'var(--warning-light)', color: threat.riskLevel === 'High' ? 'var(--danger)' : 'var(--warning)' }}>
                              {threat.riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-600">Mitigation: </span>{threat.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Module 5: Competitor Mapping */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="text-sm font-600 flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <Users className="w-4 h-4" style={{ color: 'var(--info)' }} />
                      Competitor Mapping
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated Competitors</div>
                        <div className="text-2xl font-700" style={{ color: 'var(--text-primary)' }}>{report.competitorMapping.existingSimilarUnits}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Market Saturation</div>
                        <div className="text-sm font-600 mt-1" style={{ color: report.competitorMapping.isOversaturated ? 'var(--danger)' : 'var(--emerald)' }}>
                          {report.competitorMapping.saturationStatus}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-600" style={{ color: 'var(--text-secondary)' }}>
                        <span>Density Score</span>
                        <span>{report.competitorMapping.densityScore}/100</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${report.competitorMapping.densityScore}%`,
                            background: report.competitorMapping.isOversaturated ? 'var(--danger)' : 'var(--emerald)'
                          }}
                        />
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                        Threshold: {report.competitorMapping.saturationThreshold} units per block
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module 6: Pricing & Module 7: Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Module 6: Pricing Strategy */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="text-sm font-600 flex items-center gap-2 mb-3" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <DollarSign className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                      Pricing Strategy
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                        <div className="text-[10px] font-600 uppercase" style={{ color: 'var(--text-muted)' }}>Recommended Range</div>
                        <div className="text-sm font-700 mt-0.5" style={{ color: 'var(--text-primary)' }}>{report.pricingStrategy.recommendedPriceRange}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{report.pricingStrategy.basePriceUnit}</div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                        <div className="text-[10px] font-600 uppercase" style={{ color: 'var(--text-muted)' }}>Profit Margin</div>
                        <div className="text-sm font-700 mt-0.5" style={{ color: 'var(--emerald)' }}>{report.pricingStrategy.expectedProfitMargin}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Estimated</div>
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-600">Rationale: </span>{report.pricingStrategy.pricingRecommendation}
                    </p>
                  </div>

                  {/* Module 7: Feasibility Summary */}
                  <div className="p-5 rounded-xl" style={{ background: 'var(--primary)', color: 'white' }}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-sm font-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Feasibility Summary
                      </h3>
                      <span className="text-xl font-700">{report.feasibilitySummary.overallScore} / 100</span>
                    </div>
                    <p className="text-xs font-500 mb-4 opacity-90 leading-relaxed">
                      "{report.feasibilitySummary.summaryText}"
                    </p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[10px]">
                      <div className="flex justify-between border-b border-white/20 pb-1">
                        <span className="opacity-70">Market Opportunity</span>
                        <span className="font-600">{report.feasibilitySummary.marketOpportunity}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/20 pb-1">
                        <span className="opacity-70">Demand</span>
                        <span className="font-600">{report.feasibilitySummary.demandLevel}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/20 pb-1">
                        <span className="opacity-70">Competition</span>
                        <span className="font-600">{report.feasibilitySummary.competitionLevel}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/20 pb-1">
                        <span className="opacity-70">Pricing Potential</span>
                        <span className="font-600">{report.feasibilitySummary.pricingPotential}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EMI Chart */}
                <div className="p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-600 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <Calculator className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                      {t('entrepreneur.quarterlyEmi') || 'Quarterly EMI Breakdown'}
                    </h3>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-600"
                      style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontWeight: 600 }}
                    >
                      {report.financial.moratoriumMonths} {t('entrepreneur.monthsMoratorium') || 'Months Moratorium'}
                    </span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.financial.schedule.slice(0, 12)}>
                        <XAxis dataKey="periodName" stroke="#9A9A9A" fontSize={10} />
                        <YAxis stroke="#9A9A9A" fontSize={10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-default)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-md)',
                          }}
                          formatter={(val) => formatINR(val)}
                        />
                        <Bar dataKey="principalPayment" name={t('entrepreneur.principal') || 'Principal'} fill="#059669" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="interestPayment" name={t('entrepreneur.interest') || 'Interest'} fill="#D97706" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* STEP 5: Financial Plan */}
              <div
                className="rounded-xl p-6 space-y-6"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
              >
                <div className="pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5 mb-2 inline-block">STEP 5</span>
                  <h2 className="text-xl font-700" style={{ color: 'var(--text-primary)' }}>Financial Plan & Scheme Router</h2>
                </div>
                
                {report.financial.capReason && (
                  <div className="p-3 rounded-lg text-sm bg-warning-50 text-warning-700 border border-warning-200">
                    <AlertTriangle className="w-4 h-4 inline-block mr-2" />
                    {report.financial.capReason}
                  </div>
                )}
                
                <SchemeBadge financial={report.financial} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    label={t('entrepreneur.beneficiaryEquity') || 'Beneficiary Equity (10%)'}
                    value={formatINR(report.financial.marginCapital)}
                    sub={t('entrepreneur.yourCashContribution') || 'Your cash contribution'}
                    color="var(--warning)"
                  />
                  <MetricCard
                    label={t('entrepreneur.projectCost')}
                    value={formatINR(report.financial.totalProjectCost)}
                    sub={t('entrepreneur.marginDiv') || 'Margin Capital ÷ 10%'}
                    color="var(--emerald)"
                  />
                  <MetricCard
                    label={t('entrepreneur.govtCapitalSubsidy') || 'Govt Capital Subsidy'}
                    value={formatINR(report.financial.govtSubsidyAmount)}
                    sub={`${report.financial.subsidyPercent}% ${t('entrepreneur.directGrant') || 'direct grant'}`}
                    color="var(--accent)"
                  />
                  <MetricCard
                    label={t('entrepreneur.netLoanSanction') || 'Net Loan Sanction'}
                    value={formatINR(report.financial.sanctionedLoan)}
                    sub={t('entrepreneur.disbursedByBank') || 'Disbursed by SCA Bank'}
                    color="var(--info)"
                  />
                </div>
                {/* EMI Chart moved inside STEP 5 */}
                <div className="p-5 rounded-xl mt-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-600 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <Calculator className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                      {t('entrepreneur.quarterlyEmi') || 'Quarterly EMI Breakdown'}
                    </h3>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-600"
                      style={{ background: 'var(--warning-light)', color: 'var(--warning)', fontWeight: 600 }}
                    >
                      {report.financial.moratoriumMonths} {t('entrepreneur.monthsMoratorium') || 'Months Moratorium'}
                    </span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.financial.schedule.slice(0, 12)}>
                        <XAxis dataKey="periodName" stroke="#9A9A9A" fontSize={10} />
                        <YAxis stroke="#9A9A9A" fontSize={10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-default)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-md)',
                          }}
                          formatter={(val) => formatINR(val)}
                        />
                        <Bar dataKey="principalPayment" name={t('entrepreneur.principal') || 'Principal'} fill="#059669" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="interestPayment" name={t('entrepreneur.interest') || 'Interest'} fill="#D97706" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* STEP 6 & 7: Review & Apply */}
              <div
                className="rounded-xl p-6"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
              >
                <div className="pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/5 mb-2 inline-block">STEP 6 & 7</span>
                  <h2 className="text-xl font-700" style={{ color: 'var(--text-primary)' }}>Review & Apply</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-secondary">
                    Review your Feasibility Summary ({report.feasibilitySummary.overallScore}/100) and Financial Plan ({report.financial.schemeName}). If everything looks good, apply now.
                  </p>
                  <button
                    onClick={handleApply}
                    disabled={applicationSubmitted}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', opacity: applicationSubmitted ? 0.7 : 1 }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {applicationSubmitted ? (t('entrepreneur.applied') || 'Application Submitted') : (t('entrepreneur.applyForLoan') || 'Submit Application')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── Repayment Tab ─── */}
      {activeTab === 'repayment' && (
        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
        >
          <div className="pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 className="text-xl font-700 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              <Activity className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
              {t('entrepreneur.repaymentTracker') || 'Repayment Tracker'}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('entrepreneur.repaymentTrackerDesc') || 'Real-time loan milestone tracking with moratorium grace management.'}
            </p>
          </div>

          {!userApp ? (
            <div className="text-center py-16">
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--bg-elevated)' }}
              >
                <Activity className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="text-lg font-600 mb-2" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {t('entrepreneur.noActiveApplications') || 'No Active Applications'}
              </h3>
              <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                {t('entrepreneur.noActiveApplicationsDesc') || 'Generate a feasibility report and apply for a bank loan to track repayment milestones here.'}
              </p>
              <button
                onClick={() => setActiveTab('feasibility')}
                className="btn-primary mt-5 text-sm"
              >
                {t('entrepreneur.generateReport')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Active Loan Summary */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('entrepreneur.activeBorrower') || 'Active Borrower'}</span>
                    <h3 className="text-lg font-700 mt-0.5" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {userApp.applicantName}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{userApp.originalBusinessIdea}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('entrepreneur.totalSanctioned') || 'Total Sanctioned'}</span>
                    <div className="metric-value mt-0.5" style={{ color: 'var(--emerald)' }}>
                      {formatINR(userApp.feasibilityReport.financial.sanctionedLoan)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span>{t('entrepreneur.repaymentProgress') || 'Repayment Progress: 25% (Q3 Completed)'}</span>
                    <span style={{ color: 'var(--emerald)' }}>
                      {t('entrepreneur.remaining') || 'Remaining'}: {formatINR(userApp.feasibilityReport.financial.sanctionedLoan * 0.75)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '25%', background: 'var(--emerald)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Repayment Table */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
                <table className="w-full text-sm text-left">
                  <thead style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}>
                    <tr>
                      {[
                        t('entrepreneur.tableQuarter') || 'Quarter',
                        t('entrepreneur.tableType') || 'Type',
                        t('entrepreneur.tablePrincipal') || 'Principal',
                        t('entrepreneur.tableInterest') || 'Interest',
                        t('entrepreneur.tableTotalEmi') || 'Total EMI',
                        t('entrepreneur.tableStatus') || 'Status'
                      ].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-xs font-600 uppercase tracking-wide" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userApp.feasibilityReport.financial.schedule.slice(0, 8).map((q) => (
                      <tr
                        key={q.quarter}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td className="px-4 py-3 font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {q.periodName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="badge"
                            style={
                              q.isMoratorium
                                ? { background: 'var(--warning-light)', color: 'var(--warning)' }
                                : { background: 'var(--emerald-light)', color: 'var(--emerald)' }
                            }
                          >
                            {q.isMoratorium ? (t('entrepreneur.moratorium') || 'Moratorium') : (t('entrepreneur.repayment') || 'Repayment')}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatINR(q.principalPayment)}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--warning)', fontWeight: 500 }}>{formatINR(q.interestPayment)}</td>
                        <td className="px-4 py-3 font-700" style={{ color: 'var(--emerald)', fontWeight: 700 }}>{formatINR(q.totalEMI)}</td>
                        <td className="px-4 py-3">
                          {q.quarter === 1 ? (
                            <span className="flex items-center gap-1 text-xs font-600" style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> {t('entrepreneur.paid') || 'Paid'}
                            </span>
                          ) : q.quarter === 2 ? (
                            <span className="text-xs font-500" style={{ color: 'var(--warning)' }}>{t('entrepreneur.dueNov30') || 'Due Nov 30'}</span>
                          ) : (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('entrepreneur.upcoming') || 'Upcoming'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
