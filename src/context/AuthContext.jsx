import React, { createContext, useContext, useState } from 'react';
import { INITIAL_BANK_APPLICATIONS, INITIAL_PEER_POOLS } from '../utils/mockData';
import { generateAICounterProposal } from '../utils/aiFeasibilityEngine';
import { PREDEFINED_GOVT_SCHEMES } from '../utils/financialEngine';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('entrepreneur'); // 'entrepreneur' | 'bank' | 'admin'
  const [currentUser, setCurrentUser] = useState({
    name: 'Arjun Das',
    businessIdea: 'Green Valley Foods',
    age: 34,
    contact: '+91 98765 43210',
    address: 'At Post Sualkuchi Silk Cluster, Kamrup Rural',
    location: { villageName: 'Sualkuchi', blockName: 'Kamrup Rural', districtName: 'Kamrup', stateName: 'Assam' }
  });

  // Dynamic Government Schemes database initialized with predefined schemes
  const [govtSchemes, setGovtSchemes] = useState(PREDEFINED_GOVT_SCHEMES);

  const [applications, setApplications] = useState(INITIAL_BANK_APPLICATIONS);
  const [peerPools, setPeerPools] = useState(INITIAL_PEER_POOLS);
  const [counterProposals, setCounterProposals] = useState([]);

  // System Admin action: Add new government scheme dynamically
  const addGovtScheme = (newScheme) => {
    const key = newScheme.key || `SCHEME_${Date.now()}`;
    const schemeObj = {
      key,
      name: newScheme.name,
      category: newScheme.category || 'Government Subsidy',
      maxProjectCost: Number(newScheme.maxProjectCost) || 1000000,
      interestRate: Number(newScheme.interestRate) || 7.0,
      tenureYears: Number(newScheme.tenureYears) || 5,
      moratoriumMonths: Number(newScheme.moratoriumMonths) || 6,
      subsidyPercent: Number(newScheme.subsidyPercent) || 0,
      collateralRequired: Boolean(newScheme.collateralRequired),
      description: newScheme.description || 'Newly added government assistance scheme.'
    };

    // Update state object
    setGovtSchemes((prev) => ({
      ...prev,
      [key]: schemeObj
    }));

    // Also inject into module PREDEFINED_GOVT_SCHEMES so calculation engines pick it up!
    PREDEFINED_GOVT_SCHEMES[key] = schemeObj;
    return schemeObj;
  };

  // Login & role switcher with authentication
  const switchRole = (role, userDetails = null) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    if (userDetails) {
      setCurrentUser(userDetails);
    }
  };

  const login = (role, userDetails) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setCurrentUser(userDetails);
  };

  const logout = () => {
    setIsAuthenticated(false);
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
        isAuthenticated,
        currentRole,
        currentUser,
        govtSchemes,
        addGovtScheme,
        switchRole,
        login,
        logout,
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
