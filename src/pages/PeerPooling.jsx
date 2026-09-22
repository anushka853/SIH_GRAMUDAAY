import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/financialEngine';
import { HeartHandshake, Users, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export default function PeerPooling() {
  const { peerPools, contributeToPool } = useAuth();
  const { t, speak } = useLanguage();

  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(1000);
  const [contributionSuccess, setContributionSuccess] = useState(false);

  const handleContribute = (e) => {
    e.preventDefault();
    if (!selectedPoolId) return;
    contributeToPool(selectedPoolId, contributionAmount);
    setContributionSuccess(true);
    speak(t('peer.voiceSuccess') || `Thank you! Your micro-investment of ${formatINR(contributionAmount)} has been credited to the peer margin pool.`);
    setTimeout(() => {
      setContributionSuccess(false);
      setSelectedPoolId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Page Header ─── */}
      <div>
        <p className="page-eyebrow mb-2">{t('peer.pageEyebrow') || 'Broker-Free Community Finance · SCA Verified'}</p>
        <h1 className="page-title">{t('peer.communityFunding') || 'Community Capital'}</h1>
        <p className="page-subtitle mt-2 max-w-2xl">
          {t('peer.pageSubtitle') || 'Connect viable rural businesses with community members willing to support their growth. Eliminating intermediary brokers and predatory moneylenders.'}
        </p>
      </div>

      {/* ─── Summary Metrics ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: t('peer.activePools') || 'Active Pools',
            value: peerPools.length,
            color: 'var(--emerald)',
          },
          {
            label: t('peer.fundingRequired') || 'Total Required',
            value: formatINR(peerPools.reduce((s, p) => s + p.requiredMarginTotal, 0)),
            color: 'var(--text-primary)',
          },
          {
            label: t('peer.amountRaised') || 'Total Raised',
            value: formatINR(peerPools.reduce((s, p) => s + p.raisedMarginCurrent, 0)),
            color: 'var(--accent)',
          },
          {
            label: t('peer.investors') || 'Contributors',
            value: peerPools.reduce((s, p) => s + p.contributorsCount, 0),
            color: 'var(--info)',
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-4 rounded-xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
          >
            <div className="metric-label mb-1.5">{label}</div>
            <div className="text-xl font-700" style={{ color, fontWeight: 700 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Pool Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {peerPools.map((pool) => {
          const percentRaised = Math.min(100, Math.round((pool.raisedMarginCurrent / pool.requiredMarginTotal) * 100));
          return (
            <div
              key={pool.id}
              className="rounded-xl p-5 space-y-4 transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-xs font-600 uppercase tracking-wide"
                    style={{ color: 'var(--emerald)', fontWeight: 600 }}
                  >
                    {pool.category}
                  </span>
                  <h3 className="text-lg font-700 mt-0.5" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    {pool.ventureTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {pool.entrepreneurName} · {pool.location}
                    </span>
                  </div>
                </div>
                <span
                  className="badge flex items-center gap-1 flex-shrink-0"
                  style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {t('peer.verified') || 'Verified'}
                </span>
              </div>

              {/* Story */}
              <p
                className="text-sm leading-relaxed p-3.5 rounded-xl italic"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
              >
                "{pool.story}"
              </p>

              {/* Funding Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('peer.raised') || 'Raised', value: formatINR(pool.raisedMarginCurrent), color: 'var(--emerald)' },
                  { label: t('peer.target') || 'Target', value: formatINR(pool.requiredMarginTotal), color: 'var(--text-primary)' },
                  { label: t('peer.daysRemaining') || 'Days Left', value: `${pool.daysLeft}d`, color: 'var(--warning)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className="text-sm font-700" style={{ color, fontWeight: 700 }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>{percentRaised}% {t('peer.fundedSuffix') || 'funded'}</span>
                  <span>{pool.contributorsCount} {t('peer.contributorsSuffix') || 'contributors'}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentRaised}%`,
                      background: percentRaised >= 80 ? 'var(--emerald)' : 'var(--accent)',
                    }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setSelectedPoolId(pool.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all"
                style={{
                  background: 'var(--text-primary)',
                  color: 'white',
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--text-primary)')}
              >
                <HeartHandshake className="w-4 h-4" />
                {t('peer.investInPool') || 'Invest in this Pool'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Contribution Modal ─── */}
      {selectedPoolId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedPoolId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-700 flex items-center gap-2" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                <HeartHandshake className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
                {t('peer.contributeToPool') || 'Contribute to Pool'}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {t('peer.contributeDesc') || 'Direct peer transaction. No broker fees or hidden commissions.'}
              </p>
            </div>

            {contributionSuccess ? (
              <div
                className="p-5 rounded-xl text-center space-y-2"
                style={{ background: 'var(--emerald-light)', border: '1px solid var(--emerald)30' }}
              >
                <CheckCircle2 className="w-8 h-8 mx-auto" style={{ color: 'var(--emerald)' }} />
                <h4 className="font-700 text-sm" style={{ color: 'var(--emerald)', fontWeight: 700 }}>
                  {t('peer.investmentSuccess') || 'Investment Successful!'}
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {t('peer.investmentSuccessDesc') || 'Campaign total updated in real-time.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-500 mb-2"
                    style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
                  >
                    {t('peer.contributionAmount') || 'Contribution Amount (₹)'}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-600"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      max="10000"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.625rem 0.875rem 0.625rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--emerald)',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setContributionAmount(amt)}
                      className="py-2 rounded-lg text-xs font-600 transition-all"
                      style={{
                        fontWeight: 600,
                        background: Number(contributionAmount) === amt ? 'var(--text-primary)' : 'var(--bg-elevated)',
                        color: Number(contributionAmount) === amt ? 'white' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPoolId(null)}
                    className="btn-secondary flex-1"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                  >
                    {t('peer.confirmTransfer') || 'Confirm Transfer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
