import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeBadge from '../components/SchemeBadge';
import { formatINR, compareGovernmentSchemes, calculateFinancialScheme } from '../utils/financialEngine';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Send,
  FileText,
} from 'lucide-react';

function StatusBadge({ status, isOversaturated, t }) {
  if (status === 'APPROVED') {
    return <span className="badge badge-success">{t('status.APPROVED') || 'Approved'}</span>;
  }
  if (status === 'COUNTER_PROPOSED' || isOversaturated) {
    return <span className="badge badge-warning">{t('status.saturationFlag') || 'Saturation Flag'}</span>;
  }
  return <span className="badge badge-info">{t('status.under_review') || 'Under Review'}</span>;
}

export default function BankPortal() {
  const { applications, approveApplication, triggerCounterProposal } = useAuth();
  const { t, speak } = useLanguage();

  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [activeCounterProposal, setActiveCounterProposal] = useState(null);
  const [proposalSentAppIds, setProposalSentAppIds] = useState([]);
  const [selectedSchemeKey, setSelectedSchemeKey] = useState(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const marginCap = selectedApp?.availableMarginCapital || 100000;
  const sectorKey = selectedApp?.sectorKey || 'Dairy';
  const schemeOptions = compareGovernmentSchemes(marginCap, sectorKey);
  const activeFinancial = calculateFinancialScheme(marginCap, selectedSchemeKey || selectedApp?.feasibilityReport?.financial?.schemeType);

  const handleTriggerAI = () => {
    if (!selectedApp) return;
    const proposal = triggerCounterProposal(selectedApp.id);
    setActiveCounterProposal(proposal);
    speak(
      `AI Counter-Proposal generated for ${selectedApp.applicantName}. The original idea ${selectedApp.originalBusinessIdea} is oversaturated in ${
        selectedApp.location?.blockName || 'this block'
      }. AI recommends 3 alternative models with up to 55 percent profit margins.`
    );
  };

  const handleSendProposalToUser = (appId) => {
    setProposalSentAppIds((prev) => [...prev, appId]);
  };

  const pendingCount = applications.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'COUNTER_PROPOSED').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow mb-2">{t('bank.pageEyebrow') || 'Bank Officer Portal — SCA/CA Staff Desk'}</p>
          <h1 className="page-title">{t('bank.creditAdvisory')}</h1>
          <p className="page-subtitle mt-2 max-w-2xl">
            {t('bank.pageSubtitle') || 'Review applications, feasibility reports, risk indicators, and AI-assisted scheme recommendations.'}
          </p>
        </div>
        {/* Queue summary */}
        <div className="flex gap-3 self-start sm:self-auto">
          {[
            { label: t('status.pending') || 'Pending', value: pendingCount, color: 'var(--warning)' },
            { label: t('status.approved') || 'Approved', value: approvedCount, color: 'var(--emerald)' },
            { label: t('common.total') || 'Total', value: applications.length, color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="text-center px-4 py-2 rounded-xl"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', minWidth: '70px' }}
            >
              <div className="text-xl font-700" style={{ color, fontWeight: 700 }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Queue */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <h2
              className="text-sm font-700 flex items-center gap-2"
              style={{ color: 'var(--text-primary)', fontWeight: 700 }}
            >
              <FileText className="w-4 h-4" style={{ color: 'var(--info)' }} />
              {t('bank.applicationQueue') || 'Application Queue'}
            </h2>
          </div>
          <div className="p-3 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
            {applications.map((app) => {
              const isSelected = app.id === selectedAppId;
              const isOversaturated = app.feasibilityReport?.competitorMapping?.isOversaturated;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setSelectedSchemeKey(null);
                    setActiveCounterProposal(app.counterProposal || null);
                  }}
                  className="w-full text-left p-4 rounded-xl border transition-all"
                  style={{
                    background: isSelected ? 'var(--info-light)' : 'var(--bg-elevated)',
                    borderColor: isSelected ? 'var(--info)' : 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {app.id}
                    </span>
                    <StatusBadge status={app.status} isOversaturated={isOversaturated} t={t} />
                  </div>
                  <div className="text-sm font-600" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {app.applicantName}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {app.originalBusinessIdea}
                  </div>
                  <div className="flex justify-between text-xs mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <span>{t('bank.margin') || 'Margin'}: {formatINR(app.availableMarginCapital)}</span>
                    <span>{t('bank.cost') || 'Cost'}: {formatINR(app.availableMarginCapital / 0.10)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedApp && (
          <div className="lg:col-span-2 space-y-5">
            {/* Applicant Header */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {t('bank.ref') || 'Ref'}: {selectedApp.id}
                  </span>
                  <h2 className="text-xl font-700 mt-0.5" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    {selectedApp.applicantName}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {selectedApp.address} · {selectedApp.contact}
                  </p>
                </div>
                <button
                  onClick={() => approveApplication(selectedApp.id)}
                  disabled={selectedApp.status === 'APPROVED'}
                  className="btn-primary text-sm flex-shrink-0"
                  style={{
                    background: selectedApp.status === 'APPROVED' ? 'var(--emerald-light)' : 'var(--text-primary)',
                    color: selectedApp.status === 'APPROVED' ? 'var(--emerald)' : 'white',
                    border: selectedApp.status === 'APPROVED' ? '1px solid var(--emerald)' : 'none',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedApp.status === 'APPROVED' ? (t('bank.loanSanctioned') || 'Loan Sanctioned') : (t('bank.sanctionLoan') || 'Sanction Loan')}
                </button>
              </div>
            </div>

            {/* Scheme Badge */}
            <SchemeBadge financial={activeFinancial} />

            {/* Government Scheme Comparison */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
            >
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <span
                    className="text-xs font-600 px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600 }}
                  >
                    {t('bank.aiSchemeRecommender') || 'AI Scheme Recommender'}
                  </span>
                  <h3 className="text-base font-700 mt-1.5 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    {t('bank.govtSchemeMatching') || 'Government Scheme Matching'}
                  </h3>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('bank.clickToOverride') || 'Click to override'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemeOptions.map((opt) => {
                  const isActiveScheme = (selectedSchemeKey || activeFinancial.schemeType) === opt.schemeKey;
                  return (
                    <button
                      key={opt.schemeKey}
                      onClick={() => setSelectedSchemeKey(opt.schemeKey)}
                      className="text-left p-4 rounded-xl border transition-all space-y-2"
                      style={{
                        background: isActiveScheme ? 'var(--accent-light)' : 'var(--bg-elevated)',
                        borderColor: isActiveScheme ? 'var(--accent)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>{opt.category}</span>
                          <span className="text-sm font-600 block" style={{ color: isActiveScheme ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600 }}>
                            {opt.schemeName}
                          </span>
                        </div>
                        <span
                          className="badge"
                          style={
                            opt.suitabilityScore >= 95
                              ? { background: 'var(--emerald-light)', color: 'var(--emerald)' }
                              : { background: 'var(--info-light)', color: 'var(--info)' }
                          }
                        >
                          {opt.suitabilityScore}/100
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        <div>
                          <span className="block" style={{ color: 'var(--text-muted)' }}>{t('calculator.interestRate') || 'Interest'}</span>
                          <span className="font-600" style={{ color: 'var(--warning)', fontWeight: 600 }}>{opt.interestRate}%</span>
                        </div>
                        <div>
                          <span className="block" style={{ color: 'var(--text-muted)' }}>{t('calculator.tenure') || 'Tenure'}</span>
                          <span className="font-600" style={{ color: 'var(--emerald)', fontWeight: 600 }}>{opt.tenureYears}Y</span>
                        </div>
                        <div>
                          <span className="block" style={{ color: 'var(--text-muted)' }}>{t('bank.subsidy') || 'Subsidy'}</span>
                          <span className="font-600" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                            {opt.govtSubsidyAmount > 0 ? formatINR(opt.govtSubsidyAmount) : (t('common.none') || 'None')}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>{t('bank.netSanctionedLoan') || 'Net Sanctioned Loan'}</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{formatINR(opt.sanctionedLoan)}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Market Saturation */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
            >
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 className="text-base font-700 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                  {t('bank.marketSaturationAnalysis') || 'Market Saturation Analysis'}
                </h3>
                <span
                  className="badge"
                  style={
                    selectedApp.feasibilityReport?.competitorMapping?.isOversaturated
                      ? { background: 'var(--danger-light)', color: 'var(--danger)' }
                      : { background: 'var(--emerald-light)', color: 'var(--emerald)' }
                  }
                >
                  {selectedApp.feasibilityReport?.competitorMapping?.saturationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t('bank.existingUnits') || 'Existing Units', value: `${selectedApp.feasibilityReport?.competitorMapping?.existingSimilarUnits} ${t('bank.units') || 'units'}`, color: 'var(--text-primary)' },
                  { label: t('bank.threshold') || 'Threshold', value: `${selectedApp.feasibilityReport?.competitorMapping?.saturationThreshold} ${t('bank.units') || 'units'}`, color: 'var(--text-primary)' },
                  { label: t('bank.densityScore') || 'Density Score', value: `${selectedApp.feasibilityReport?.competitorMapping?.densityScore}%`, color: 'var(--warning)' },
                  { label: t('bank.viabilityScore') || 'Viability Score', value: `${selectedApp.feasibilityReport?.competitorMapping?.marketViabilityScore}/100`, color: 'var(--emerald)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    <div className="text-base font-700" style={{ color, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              {selectedApp.feasibilityReport?.competitorMapping?.isOversaturated && (
                <div className="mt-4">
                  <button
                    onClick={handleTriggerAI}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-600 transition-all"
                    style={{
                      background: 'var(--warning-light)',
                      color: 'var(--warning)',
                      border: '1px solid #FDE68A',
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FDE68A')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--warning-light)')}
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('bank.triggerAiCounterProposal') || 'Trigger AI Counter-Proposal for Oversaturated Business'}
                  </button>
                </div>
              )}
            </div>

            {/* Counter Proposal */}
            {(activeCounterProposal || selectedApp.counterProposal) && (
              <div
                className="rounded-xl p-5 space-y-5 fade-in"
                style={{ background: 'var(--bg-surface)', border: '1px solid #FDE68A' }}
              >
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span
                      className="badge badge-warning flex items-center gap-1 mb-2 w-fit"
                    >
                      <Sparkles className="w-3 h-3" />
                      {t('bank.aiCounterProposalTitle') || 'AI Counter-Proposal'}
                    </span>
                    <h3 className="text-base font-700" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {t('bank.lowCompetitionHighProfit') || 'Low-Competition High-Profit Alternatives'}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleSendProposalToUser(selectedApp.id)}
                    disabled={proposalSentAppIds.includes(selectedApp.id)}
                    className="btn-secondary text-sm flex items-center gap-2"
                    style={{
                      background: proposalSentAppIds.includes(selectedApp.id) ? 'var(--emerald-light)' : undefined,
                      borderColor: proposalSentAppIds.includes(selectedApp.id) ? 'var(--emerald)' : undefined,
                      color: proposalSentAppIds.includes(selectedApp.id) ? 'var(--emerald)' : undefined,
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {proposalSentAppIds.includes(selectedApp.id) ? (t('bank.sent') || 'Sent') : (t('bank.sendToEntrepreneur') || 'Send to Entrepreneur')}
                  </button>
                </div>

                <p className="text-sm leading-relaxed p-3.5 rounded-xl" style={{ background: 'var(--warning-light)', color: 'var(--text-secondary)' }}>
                  {(activeCounterProposal || selectedApp.counterProposal).saturationNote}
                </p>

                <div className="space-y-3">
                  {(activeCounterProposal || selectedApp.counterProposal).alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl space-y-3"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-600" style={{ color: 'var(--warning)', fontWeight: 600 }}>
                            {t('bank.option') || 'Option'} {idx + 1} · {alt.schemeRecommendation}
                          </span>
                          <h4 className="text-base font-700 mt-0.5" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                            {alt.title}
                          </h4>
                        </div>
                        <span className="badge badge-success">{t('bank.score') || 'Score'}: {alt.viabilityScore}/100</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {alt.reasoning}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: t('bank.profitMargin') || 'Profit Margin', value: alt.expectedProfitMargin, color: 'var(--emerald)' },
                          { label: t('bank.paybackPeriod') || 'Payback Period', value: alt.paybackPeriodYears, color: 'var(--info)' },
                          { label: t('bank.competition') || 'Competition', value: alt.competitionDensity, color: 'var(--accent)' },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                            <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                            <div className="text-sm font-600" style={{ color, fontWeight: 600 }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
