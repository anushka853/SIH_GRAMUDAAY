import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR } from '../utils/financialEngine';
import { HeartHandshake, Users, ShieldCheck, Plus, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

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
    speak(`Thank you! Your micro-investment of ${formatINR(contributionAmount)} has been credited to the peer margin pool.`);
    setTimeout(() => {
      setContributionSuccess(false);
      setSelectedPoolId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-950/90 via-slate-900 to-emerald-950/90 border border-teal-500/30 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" /> Broker-Free Community Finance
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
              SCA Verified Peer Pooling
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Peer Micro-Investment Pool for Beneficiary Margin Capital
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Eliminating intermediary brokers and predatory moneylenders. Rural peers, relatives, and village SHG cooperatives pool remaining 10% margin money directly to unlock government loan eligibility.
          </p>
        </div>

        <button
          onClick={() => speak(`Peer Micro-Investment Pool. Here rural entrepreneurs can raise missing 10 percent margin money from trusted local community members without brokers.`)}
          className="px-4 py-2 bg-teal-950 text-teal-400 border border-teal-800 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Audio Explanation
        </button>
      </div>

      {/* Peer Pool Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {peerPools.map((pool) => {
          const percentRaised = Math.min(100, Math.round((pool.raisedMarginCurrent / pool.requiredMarginTotal) * 100));

          return (
            <div
              key={pool.id}
              className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800 hover:border-teal-500/40 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">{pool.category}</span>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">{pool.ventureTitle}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {pool.entrepreneurName} ({pool.location})
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-extrabold rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> SCA Verified
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                "{pool.story}"
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">
                    Raised: <strong className="text-emerald-400">{formatINR(pool.raisedMarginCurrent)}</strong>
                  </span>
                  <span className="text-slate-400">
                    Target Margin: <strong className="text-amber-400">{formatINR(pool.requiredMarginTotal)}</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentRaised}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>{percentRaised}% Funded ({pool.contributorsCount} Peer Contributors)</span>
                  <span>{pool.daysLeft} Days Remaining</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedPoolId(pool.id)}
                className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-950 transition-all flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Micro-Invest in this Peer Margin Pool</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Contribution Modal */}
      {selectedPoolId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-400" />
              Contribute to Peer Margin Pool
            </h3>
            <p className="text-xs text-slate-400">
              Direct peer transaction. No broker fees or hidden commissions.
            </p>

            {contributionSuccess ? (
              <div className="p-4 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-sm">Micro-Investment Successful!</h4>
                <p className="text-xs text-slate-300">Updated campaign total in real-time.</p>
              </div>
            ) : (
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contribution Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      max="10000"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setContributionAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        Number(contributionAmount) === amt
                          ? 'bg-teal-600 text-white border-teal-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPoolId(null)}
                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-950"
                  >
                    Confirm Peer Transfer
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
