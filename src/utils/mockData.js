// Mock Pre-seeded Data for GramUday AI
// DEMO ENVIRONMENT - ALL DATA IS DETERMINISTIC AND FICTIONAL

import { generateFeasibilityReport } from './aiFeasibilityEngine';

export const SECTIONS_PRESETS = [
  { key: 'FoodProcessing', label: 'Food Processing', icon: 'Wheat' },
  { key: 'Textiles', label: 'Textiles', icon: 'Scissors' },
  { key: 'Dairy', label: 'Dairy', icon: 'Milk' },
  { key: 'Retail', label: 'Retail & Kirana Store', icon: 'Store' },
  { key: 'SolarAgri', label: 'Solar Power & Agri Equipment', icon: 'Sun' }
];

export const REGIONS_PRESETS = [
  { village: 'Demo Village', block: 'Silchar Block', district: 'Cachar', state: 'Assam' },
  { village: 'Chandgad', block: 'Kolhapur South', district: 'Kolhapur', state: 'Maharashtra' },
  { village: 'Sulur', block: 'Coimbatore East', district: 'Coimbatore', state: 'Tamil Nadu' },
  { village: 'Rampur', block: 'Anand Rural', district: 'Anand', state: 'Gujarat' },
  { village: 'Shivpur', block: 'Varanasi North', district: 'Varanasi', state: 'Uttar Pradesh' }
];

// Helper to generate a consistent application payload
function createDemoApplication(id, applicantName, businessIdea, sectorKey, marginCapital, status, location, appliedAt, bankReview) {
  const feasibilityReport = generateFeasibilityReport({
    location,
    marginCapital,
    businessIdea,
    sectorKey
  });
  
  return {
    id,
    applicantName,
    originalBusinessIdea: businessIdea,
    sectorKey,
    availableMarginCapital: marginCapital,
    status,
    location,
    appliedAt,
    feasibilityReport,
    bankReview
  };
}

const silcharLocation = { villageName: 'Demo Village', blockName: 'Silchar Block', districtName: 'Cachar', stateName: 'Assam' };

// Initial Bank Applications Queue for Bank Portal (8 Applications)
export const INITIAL_BANK_APPLICATIONS = [
  createDemoApplication(
    'GRM-1001',
    'Arjun Das',
    'Green Valley Foods',
    'FoodProcessing',
    100000,
    'PENDING',
    silcharLocation,
    '2026-08-14T10:30:00Z',
    {
      riskLevel: 'Moderate',
      marketStatus: 'Balanced',
      aiRecommendation: 'Proceed after validating retail distribution channels.',
      saturationWarning: 'Competition is moderate; differentiation should focus on packaging and reliable supply.',
      counterProposal: 'Begin with a smaller initial product range and expand after validating repeat demand.'
    }
  ),
  createDemoApplication(
    'GRM-1002',
    'Meena Devi',
    'Shakti Tailoring Unit',
    'Textiles',
    12000,
    'UNDER_REVIEW',
    silcharLocation,
    '2026-08-19T14:15:00Z',
    {
      riskLevel: 'Low',
      marketStatus: 'High Potential',
      aiRecommendation: 'Strong candidate for Micro Finance Scheme.',
      saturationWarning: 'None. Market shows steady demand for custom tailoring.',
      counterProposal: null
    }
  ),
  createDemoApplication(
    'GRM-1003',
    'Rahul Sen',
    'North Valley Dairy',
    'Dairy',
    250000,
    'APPROVED',
    silcharLocation,
    '2026-08-23T09:00:00Z',
    {
      riskLevel: 'Low',
      marketStatus: 'High Potential',
      aiRecommendation: 'Approve Term Loan. Strong margin capital provided.',
      saturationWarning: 'None.',
      counterProposal: null
    }
  ),
  createDemoApplication(
    'GRM-1004',
    'Kiran Bora',
    'Boundary Textile Unit',
    'Textiles',
    14000,
    'NEEDS_MODIFICATION',
    silcharLocation,
    '2026-08-24T11:20:00Z',
    {
      riskLevel: 'Moderate',
      marketStatus: 'Balanced',
      aiRecommendation: 'Verify exact project cost before finalizing Micro Finance route.',
      saturationWarning: 'Nearing saturation in neighboring blocks.',
      counterProposal: 'Reduce margin to ₹12,000 to keep project strictly within Micro Finance comfortable limits.'
    }
  ),
  createDemoApplication(
    'GRM-1005',
    'Sunita Patel',
    'Sunrise Organic Grocers',
    'Retail',
    50000,
    'APPROVED',
    { villageName: 'Rampur', blockName: 'Anand Rural', districtName: 'Anand', stateName: 'Gujarat' },
    '2026-08-25T15:30:00Z',
    {
      riskLevel: 'Low',
      marketStatus: 'Balanced',
      aiRecommendation: 'Approve. Retail demand is stable in Anand Rural.',
      saturationWarning: 'None.',
      counterProposal: null
    }
  ),
  createDemoApplication(
    'GRM-1006',
    'Vikram Singh',
    'Solar Pump Solutions',
    'SolarAgri',
    85000,
    'PENDING',
    { villageName: 'Shivpur', blockName: 'Varanasi North', districtName: 'Varanasi', stateName: 'Uttar Pradesh' },
    '2026-08-26T10:00:00Z',
    {
      riskLevel: 'Low',
      marketStatus: 'High Potential',
      aiRecommendation: 'Excellent market gap. Proceed with Term Loan.',
      saturationWarning: 'None.',
      counterProposal: null
    }
  ),
  createDemoApplication(
    'GRM-1007',
    'Anjali Desai',
    'Eco-Packaging Retail',
    'Retail',
    22000,
    'REJECTED',
    { villageName: 'Chandgad', blockName: 'Kolhapur South', districtName: 'Kolhapur', stateName: 'Maharashtra' },
    '2026-08-27T16:45:00Z',
    {
      riskLevel: 'High',
      marketStatus: 'Oversaturated',
      aiRecommendation: 'High risk due to intense existing competition in Kolhapur South.',
      saturationWarning: 'Market is oversaturated with retail shops.',
      counterProposal: 'Shift focus to a specialized Agri-Processing niche instead.'
    }
  ),
  createDemoApplication(
    'GRM-1008',
    'Ramesh Kumar',
    'Village Milk Chillers',
    'Dairy',
    120000,
    'UNDER_REVIEW',
    { villageName: 'Sulur', blockName: 'Coimbatore East', districtName: 'Coimbatore', stateName: 'Tamil Nadu' },
    '2026-08-28T12:10:00Z',
    {
      riskLevel: 'Moderate',
      marketStatus: 'Balanced',
      aiRecommendation: 'Validate cold chain electricity reliability before approval.',
      saturationWarning: 'Moderate competition, but high daily demand.',
      counterProposal: 'Ensure part of the loan is allocated for solar backup.'
    }
  )
];

// Initial Peer Micro-Investment Pool Campaign Listings
export const INITIAL_PEER_POOLS = [
  {
    id: 'POOL-101',
    entrepreneurName: 'Arjun Das',
    location: 'Silchar Block, Cachar (Assam)',
    ventureTitle: 'Green Valley Foods',
    requiredMarginTotal: 300000,
    raisedMarginCurrent: 185000,
    contributorsCount: 27,
    minContribution: 500,
    daysLeft: 12,
    story: 'Small-scale processing and packaging of locally sourced vegetables and food products for nearby households, retailers, and weekly markets.',
    category: 'Food Processing',
    verifiedBySCA: true,
    feasibilityScore: 78
  },
  {
    id: 'POOL-102',
    entrepreneurName: 'Women SHG',
    location: 'Pandaul, Madhubani (Bihar)',
    ventureTitle: 'Bamboo Craft Collective',
    requiredMarginTotal: 50000,
    raisedMarginCurrent: 42000,
    contributorsCount: 18,
    minContribution: 200,
    daysLeft: 4,
    story: 'Expanding our traditional bamboo crafting to supply eco-friendly products to district wholesalers.',
    category: 'Handicrafts',
    verifiedBySCA: true,
    feasibilityScore: 82
  },
  {
    id: 'POOL-103',
    entrepreneurName: 'Rajesh & Co',
    location: 'Coimbatore East (Tamil Nadu)',
    ventureTitle: 'Millet Kitchen',
    requiredMarginTotal: 150000,
    raisedMarginCurrent: 60000,
    contributorsCount: 10,
    minContribution: 1000,
    daysLeft: 20,
    story: 'Setting up a commercial millet processing unit to create healthy ready-to-eat snacks for rural and urban markets.',
    category: 'Food Processing',
    verifiedBySCA: false,
    feasibilityScore: 75
  },
  {
    id: 'POOL-104',
    entrepreneurName: 'GramPanchayat Coop',
    location: 'Anand Rural (Gujarat)',
    ventureTitle: 'Village Dairy Cooperative',
    requiredMarginTotal: 500000,
    raisedMarginCurrent: 250000,
    contributorsCount: 45,
    minContribution: 1000,
    daysLeft: 30,
    story: 'Upgrading the local village dairy collection center with modern solar chilling equipment.',
    category: 'Dairy',
    verifiedBySCA: true,
    feasibilityScore: 88
  },
  {
    id: 'POOL-105',
    entrepreneurName: 'Kavita Weaver',
    location: 'Varanasi North (UP)',
    ventureTitle: 'Handloom Studio',
    requiredMarginTotal: 80000,
    raisedMarginCurrent: 80000,
    contributorsCount: 22,
    minContribution: 500,
    daysLeft: 0,
    story: 'Procuring 4 new handloom machines to expand our silk saree production capacity.',
    category: 'Textiles',
    verifiedBySCA: true,
    feasibilityScore: 85
  },
  {
    id: 'POOL-106',
    entrepreneurName: 'Sanjay Auto',
    location: 'Kolhapur South (Maharashtra)',
    ventureTitle: 'Rural Repair Workshop',
    requiredMarginTotal: 120000,
    raisedMarginCurrent: 30000,
    contributorsCount: 5,
    minContribution: 1000,
    daysLeft: 25,
    story: 'Setting up a multi-purpose repair workshop for tractors, agri-equipment, and two-wheelers.',
    category: 'Services',
    verifiedBySCA: true,
    feasibilityScore: 72
  }
];

// Admin Deterministic Regional Data
export const ADMIN_REGIONAL_METRICS = [
  { region: 'Assam', applications: 245, approved: 180, pending: 45, fundingActive: 12, avgProjectCost: 850000 },
  { region: 'Maharashtra', applications: 412, approved: 320, pending: 60, fundingActive: 28, avgProjectCost: 1100000 },
  { region: 'Tamil Nadu', applications: 350, approved: 290, pending: 40, fundingActive: 18, avgProjectCost: 1050000 },
  { region: 'Karnataka', applications: 280, approved: 210, pending: 55, fundingActive: 14, avgProjectCost: 920000 },
  { region: 'West Bengal', applications: 190, approved: 130, pending: 50, fundingActive: 8, avgProjectCost: 650000 },
  { region: 'Gujarat', applications: 310, approved: 260, pending: 30, fundingActive: 16, avgProjectCost: 1250000 },
  { region: 'Telangana', applications: 220, approved: 165, pending: 45, fundingActive: 9, avgProjectCost: 880000 },
  { region: 'Uttar Pradesh', applications: 540, approved: 380, pending: 110, fundingActive: 35, avgProjectCost: 750000 }
];
