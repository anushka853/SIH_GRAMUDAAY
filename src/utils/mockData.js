// Mock Pre-seeded Data for GramUday AI
import { generateFeasibilityReport } from './aiFeasibilityEngine';

export const SECTIONS_PRESETS = [
  { key: 'Dairy', label: 'Dairy & Animal Husbandry', icon: 'Milk' },
  { key: 'Retail', label: 'Retail & Kirana Store', icon: 'Store' },
  { key: 'Textiles', label: 'Textiles & Handloom Garments', icon: 'Scissors' },
  { key: 'SolarAgri', label: 'Solar Power & Agri Equipment', icon: 'Sun' },
  { key: 'FoodProcessing', label: 'Agri Processing & Flour/Spice Mill', icon: 'Wheat' }
];

export const REGIONS_PRESETS = [
  { village: 'Rampur', block: 'Anand Rural', district: 'Anand', state: 'Gujarat' },
  { village: 'Shivpur', block: 'Varanasi North', district: 'Varanasi', state: 'Uttar Pradesh' },
  { village: 'Chandgad', block: 'Kolhapur South', district: 'Kolhapur', state: 'Maharashtra' },
  { village: 'Sulur', block: 'Coimbatore East', district: 'Coimbatore', state: 'Tamil Nadu' },
  { village: 'Pandaul', block: 'Madhubani Central', district: 'Madhubani', state: 'Bihar' }
];

// Initial Bank Applications Queue for Bank Portal
export const INITIAL_BANK_APPLICATIONS = [
  {
    id: 'APP-98421',
    applicantName: 'Ramesh Patel',
    age: 34,
    contact: '+91 98765 43210',
    address: 'At Post Rampur, Anand Rural Block',
    location: { villageName: 'Rampur', blockName: 'Anand Rural', districtName: 'Anand', stateName: 'Gujarat' },
    originalBusinessIdea: 'Dairy Retail Shop',
    sectorKey: 'Dairy',
    availableMarginCapital: 100000,
    status: 'COUNTER_PROPOSED', // Flagged as oversaturated
    appliedAt: '2026-09-08T10:30:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Rampur', block: 'Anand Rural', district: 'Anand', state: 'Gujarat' },
      marginCapital: 100000,
      businessIdea: 'Dairy Retail Shop',
      sectorKey: 'Dairy'
    })
  },
  {
    id: 'APP-98422',
    applicantName: 'Sunita Devi',
    age: 29,
    contact: '+91 94123 88901',
    address: 'Village Shivpur, Varanasi Block',
    location: { villageName: 'Shivpur', blockName: 'Varanasi North', districtName: 'Varanasi', stateName: 'Uttar Pradesh' },
    originalBusinessIdea: 'Handloom Textile & Embroidery Unit',
    sectorKey: 'Textiles',
    availableMarginCapital: 45000,
    status: 'APPROVED',
    appliedAt: '2026-09-09T14:15:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Shivpur', block: 'Varanasi North', district: 'Varanasi', state: 'Uttar Pradesh' },
      marginCapital: 45000,
      businessIdea: 'Handloom Textile & Embroidery Unit',
      sectorKey: 'Textiles'
    })
  },
  {
    id: 'APP-98423',
    applicantName: 'Anand Kumar',
    age: 41,
    contact: '+91 91234 56789',
    address: 'Sulur Gram Panchayat, Coimbatore',
    location: { villageName: 'Sulur', blockName: 'Coimbatore East', districtName: 'Coimbatore', stateName: 'Tamil Nadu' },
    originalBusinessIdea: 'Solar Powered Grain Dryer & Custom Hire',
    sectorKey: 'SolarAgri',
    availableMarginCapital: 150000,
    status: 'PENDING_REVIEW',
    appliedAt: '2026-09-10T08:45:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Sulur', block: 'Coimbatore East', district: 'Coimbatore', state: 'Tamil Nadu' },
      marginCapital: 150000,
      businessIdea: 'Solar Powered Grain Dryer & Custom Hire',
      sectorKey: 'SolarAgri'
    })
  }
];

// Initial Peer Micro-Investment Pool Campaign Listings
export const INITIAL_PEER_POOLS = [
  {
    id: 'POOL-101',
    entrepreneurName: 'Priya Shinde',
    location: 'Chandgad, Kolhapur (Maharashtra)',
    ventureTitle: 'Women-Led Cold Pressed Oil Mill',
    requiredMarginTotal: 50000,
    raisedMarginCurrent: 38000,
    contributorsCount: 14,
    minContribution: 500,
    daysLeft: 6,
    story: 'We are a group of 5 rural women setting up a cold-pressed mustard oil mill. We have raised ₹38,000 for our 10% margin and need ₹12,000 more to unlock our ₹4,50,000 Term Loan Scheme funding.',
    category: 'Agri-Processing',
    verifiedBySCA: true
  },
  {
    id: 'POOL-102',
    entrepreneurName: 'Mukesh Kumar',
    location: 'Pandaul, Madhubani (Bihar)',
    ventureTitle: 'Solar Irrigation Water Pump Rental',
    requiredMarginTotal: 30000,
    raisedMarginCurrent: 22500,
    contributorsCount: 9,
    minContribution: 500,
    daysLeft: 11,
    story: 'Providing clean solar pump irrigation to 40 smallholder farmers in Pandaul village. Need ₹7,500 to complete 10% margin contribution for Micro Finance Scheme.',
    category: 'Solar Energy',
    verifiedBySCA: true
  }
];

// Admin Dashboard Regional Metrics
export const ADMIN_REGIONAL_METRICS = {
  totalEntrepreneursRegistered: 14280,
  activeMicroEnterprises: 11640,
  overallSuccessRatePercent: 88.4,
  totalMarginMobilized: 142800000, // ₹14.28 Cr
  totalLoanSanctioned: 1285200000, // ₹128.52 Cr
  microFinanceSharePercent: 38,
  termLoanSharePercent: 62,
  districtRankings: [
    { district: 'Anand (Gujarat)', activeUnits: 2840, successRate: 92.1, fundDisbursed: '₹31.4 Cr', saturationRisk: 'Low' },
    { district: 'Varanasi (UP)', activeUnits: 3120, successRate: 87.5, fundDisbursed: '₹34.8 Cr', saturationRisk: 'Medium' },
    { district: 'Kolhapur (MH)', activeUnits: 2450, successRate: 90.2, fundDisbursed: '₹26.1 Cr', saturationRisk: 'Low' },
    { district: 'Coimbatore (TN)', activeUnits: 1980, successRate: 91.8, fundDisbursed: '₹21.5 Cr', saturationRisk: 'Low' },
    { district: 'Madhubani (Bihar)', activeUnits: 1250, successRate: 82.4, fundDisbursed: '₹14.7 Cr', saturationRisk: 'High (Dairy Saturated)' }
  ]
};
