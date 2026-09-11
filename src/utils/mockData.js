// Mock Pre-seeded Data for GramUday AI
import { generateFeasibilityReport } from './aiFeasibilityEngine';

export const SECTIONS_PRESETS = [
  { key: 'Dairy', label: 'Dairy & Animal Husbandry', icon: 'Milk' },
  { key: 'Retail', label: 'Retail & Kirana Store', icon: 'Store' },
  { key: 'Textiles', label: 'Textiles & Muga/Eri Silk Handloom', icon: 'Scissors' },
  { key: 'SolarAgri', label: 'Solar Power & Agri Irrigation', icon: 'Sun' },
  { key: 'FoodProcessing', label: 'Assam Tea & Spice Agri-Processing', icon: 'Wheat' },
  { key: 'BambooCraft', label: 'Bamboo Handicraft & Furniture Unit', icon: 'Tree' },
  { key: 'Fisheries', label: 'Inland Fisheries & Biofloc Hatchery', icon: 'Fish' }
];

export const REGIONS_PRESETS = [
  // Assam Rural Datasets (Rich Regional Profiles)
  { village: 'Sualkuchi', block: 'Kamrup Rural', district: 'Kamrup', state: 'Assam', specialty: 'Silk Weaving & Handloom' },
  { village: 'Majuli Island', block: 'Kamalabari', district: 'Majuli', state: 'Assam', specialty: 'Organic Tea & Tourism' },
  { village: 'Tezpur Rural', block: 'Gabharu', district: 'Sonitpur', state: 'Assam', specialty: 'Solar Agri & Horticulture' },
  { village: 'Barpeta Rural', block: 'Barpeta Town', district: 'Barpeta', state: 'Assam', specialty: 'Bell Metal Craft & Mustard Oil' },
  { village: 'Nagaon Rural', block: 'Kaliabor', district: 'Nagaon', state: 'Assam', specialty: 'Biofloc Fisheries & Rice Milling' },
  { village: 'Hajo', block: 'Hajo Central', district: 'Kamrup Rural', state: 'Assam', specialty: 'Brassware & Ecotourism' },
  { village: 'Silchar Rural', block: 'Lakhipur', district: 'Cachar', state: 'Assam', specialty: 'Bamboo Craft & Arecanut' },
  { village: 'Dhemaji Rural', block: 'Dhemaji', district: 'Dhemaji', state: 'Assam', specialty: 'Piggery & Integrated Farming' },
  { village: 'Golaghat Rural', block: 'Bokakhat', district: 'Golaghat', state: 'Assam', specialty: 'Organic Honey & Bio-Fertilizer' },
  { village: 'Lakhimpur Rural', block: 'Bihpuria', district: 'Lakhimpur', state: 'Assam', specialty: 'Sericulture & Spice Processing' },
  // National Datasets
  { village: 'Rampur', block: 'Anand Rural', district: 'Anand', state: 'Gujarat', specialty: 'Dairy & Milk Processing' },
  { village: 'Shivpur', block: 'Varanasi North', district: 'Varanasi', state: 'Uttar Pradesh', specialty: 'Handloom & Agri Produce' },
  { village: 'Chandgad', block: 'Kolhapur South', district: 'Kolhapur', state: 'Maharashtra', specialty: 'Sugarcane & Jaggery Processing' }
];

// Initial Bank Applications Queue for Bank Portal
export const INITIAL_BANK_APPLICATIONS = [
  {
    id: 'APP-AS-98421',
    applicantName: 'Bhaben Gogoi',
    age: 32,
    contact: '+91 98640 12345',
    address: 'At Post Sualkuchi Silk Cluster, Kamrup',
    location: { villageName: 'Sualkuchi', blockName: 'Kamrup Rural', districtName: 'Kamrup', stateName: 'Assam' },
    originalBusinessIdea: 'Traditional Muga & Eri Silk Weaving Unit',
    sectorKey: 'Textiles',
    availableMarginCapital: 85000,
    status: 'COUNTER_PROPOSED', // Flagged by AI saturation radar
    appliedAt: '2026-09-08T10:30:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Sualkuchi', block: 'Kamrup Rural', district: 'Kamrup', state: 'Assam' },
      marginCapital: 85000,
      businessIdea: 'Traditional Muga & Eri Silk Weaving Unit',
      sectorKey: 'Textiles'
    })
  },
  {
    id: 'APP-AS-98422',
    applicantName: 'Jahnabi Saikia',
    age: 28,
    contact: '+91 94350 88901',
    address: 'Kamalabari Satra, Majuli Island',
    location: { villageName: 'Majuli Island', blockName: 'Kamalabari', districtName: 'Majuli', stateName: 'Assam' },
    originalBusinessIdea: 'Organic Assam Orthodox Tea & Herbs Packaging',
    sectorKey: 'FoodProcessing',
    availableMarginCapital: 50000,
    status: 'APPROVED',
    appliedAt: '2026-09-09T14:15:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Majuli Island', block: 'Kamalabari', district: 'Majuli', state: 'Assam' },
      marginCapital: 50000,
      businessIdea: 'Organic Assam Orthodox Tea & Herbs Packaging',
      sectorKey: 'FoodProcessing'
    })
  },
  {
    id: 'APP-AS-98423',
    applicantName: 'Himanta Borah',
    age: 39,
    contact: '+91 91012 34567',
    address: 'Gabharu Gram Panchayat, Tezpur',
    location: { villageName: 'Tezpur Rural', blockName: 'Gabharu', districtName: 'Sonitpur', stateName: 'Assam' },
    originalBusinessIdea: 'Solar Cold Storage for Agri Horticulture',
    sectorKey: 'SolarAgri',
    availableMarginCapital: 120000,
    status: 'PENDING_REVIEW',
    appliedAt: '2026-09-10T08:45:00Z',
    feasibilityReport: generateFeasibilityReport({
      location: { village: 'Tezpur Rural', block: 'Gabharu', district: 'Sonitpur', state: 'Assam' },
      marginCapital: 120000,
      businessIdea: 'Solar Cold Storage for Agri Horticulture',
      sectorKey: 'SolarAgri'
    })
  }
];

// Initial Peer Micro-Investment Pool Campaign Listings
export const INITIAL_PEER_POOLS = [
  {
    id: 'POOL-AS-101',
    entrepreneurName: 'Pratima Das',
    location: 'Sualkuchi, Kamrup (Assam)',
    ventureTitle: 'Women Handloom SHG Silk Collective',
    requiredMarginTotal: 60000,
    raisedMarginCurrent: 44000,
    contributorsCount: 16,
    minContribution: 500,
    daysLeft: 5,
    story: 'We are a group of 8 women weavers in Sualkuchi setting up an automated jacquard silk handloom unit. We have pooled ₹44,000 and need ₹16,000 to unlock our ₹5,40,000 PMEGP 35% Govt Subsidy Loan.',
    category: 'Textiles & Handloom',
    verifiedBySCA: true
  },
  {
    id: 'POOL-AS-102',
    entrepreneurName: 'Tapan Hazarika',
    location: 'Majuli Island (Assam)',
    ventureTitle: 'Bamboo Bio-Degradable Straw & Craft Unit',
    requiredMarginTotal: 35000,
    raisedMarginCurrent: 26000,
    contributorsCount: 11,
    minContribution: 500,
    daysLeft: 9,
    story: 'Exporting eco-friendly bamboo crafts and straws directly from Majuli Island. Need ₹9,000 to complete 10% margin equity for SCA Micro Finance Scheme.',
    category: 'Bamboo Craft',
    verifiedBySCA: true
  }
];

// Admin Dashboard Regional Metrics
export const ADMIN_REGIONAL_METRICS = {
  totalEntrepreneursRegistered: 18450,
  activeMicroEnterprises: 15120,
  overallSuccessRatePercent: 91.2,
  totalMarginMobilized: 184500000, // ₹18.45 Cr
  totalLoanSanctioned: 1660500000, // ₹166.05 Cr
  microFinanceSharePercent: 42,
  termLoanSharePercent: 58,
  districtRankings: [
    { district: 'Kamrup (Assam)', activeUnits: 3420, successRate: 94.2, fundDisbursed: '₹42.5 Cr', saturationRisk: 'Low Saturation' },
    { district: 'Majuli (Assam)', activeUnits: 2150, successRate: 92.8, fundDisbursed: '₹28.4 Cr', saturationRisk: 'Low Saturation' },
    { district: 'Sonitpur (Assam)', activeUnits: 2890, successRate: 89.5, fundDisbursed: '₹31.2 Cr', saturationRisk: 'Moderate Risk' },
    { district: 'Anand (Gujarat)', activeUnits: 2840, successRate: 92.1, fundDisbursed: '₹31.4 Cr', saturationRisk: 'Low Saturation' },
    { district: 'Varanasi (UP)', activeUnits: 3120, successRate: 87.5, fundDisbursed: '₹34.8 Cr', saturationRisk: 'Moderate Risk' }
  ]
};
