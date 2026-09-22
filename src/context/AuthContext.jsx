import React, { createContext, useContext, useState } from 'react';
import { INITIAL_BANK_APPLICATIONS, INITIAL_PEER_POOLS } from '../utils/mockData';
import { generateAICounterProposal } from '../utils/aiFeasibilityEngine';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState('entrepreneur'); // 'entrepreneur' | 'bank' | 'admin'
  const [currentUser, setCurrentUser] = useState({
    name: 'Arjun Das',
    businessIdea: 'Green Valley Foods',
    age: 34,
    contact: '+91 98765 43210',
    address: 'Demo Village, Silchar Block',
    location: { villageName: 'Demo Village', blockName: 'Silchar Block', districtName: 'Cachar', stateName: 'Assam' }
  });

  const [applications, setApplications] = useState(INITIAL_BANK_APPLICATIONS);
  const [peerPools, setPeerPools] = useState(INITIAL_PEER_POOLS);
  const [counterProposals, setCounterProposals] = useState([]);

  // Login role switcher
  const switchRole = (role, userDetails = null) => {
    setCurrentRole(role);
    if (userDetails) {
      setCurrentUser(userDetails);
    }
  };

  // Submit new user feasibility application to Bank Queue
  const submitApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Bank Action: Approve loan application
  const approveApplication = (appId) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'APPROVED', approvedAt: new Date().toISOString() } : app))
    );
  };

  // Bank Action: Trigger AI Counter Proposal
  const triggerCounterProposal = (appId) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    const proposal = generateAICounterProposal(app);
    setCounterProposals((prev) => [proposal, ...prev]);

    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...app, status: 'COUNTER_PROPOSED', counterProposal: proposal } : a))
    );
    return proposal;
  };

  // Entrepreneur Action: Accept AI Counter Proposal
  const acceptCounterProposal = (appId, alternativeTitle) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            originalBusinessIdea: `${alternativeTitle} (AI Counter-Proposal Accepted)`,
            status: 'APPROVED',
            counterProposalAccepted: true
          };
        }
        return a;
      })
    );
  };

  // Peer Pooling Action: Contribute funds to margin pool
  const contributeToPool = (poolId, amount) => {
    setPeerPools((prev) =>
      prev.map((pool) => {
        if (pool.id === poolId) {
          const newRaised = pool.raisedMarginCurrent + Number(amount);
          return {
            ...pool,
            raisedMarginCurrent: newRaised,
            contributorsCount: pool.contributorsCount + 1
          };
        }
        return pool;
      })
    );
  };

  const submitPeerFunding = contributeToPool;

  // Reset Demo Data
  const resetDemoData = () => {
    setApplications(INITIAL_BANK_APPLICATIONS);
    setPeerPools(INITIAL_PEER_POOLS);
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        applications,
        peerPools,
        counterProposals,
        switchRole,
        submitApplication,
        approveApplication,
        triggerCounterProposal,
        acceptCounterProposal,
        contributeToPool,
        submitPeerFunding,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
