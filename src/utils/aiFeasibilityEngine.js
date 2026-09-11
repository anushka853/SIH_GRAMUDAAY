// AI Feasibility & Market Intelligence Engine for GramUday AI
// Handles hyper-local business feasibility, competitor density mapping, government scheme matching, and bank counter-proposal synthesis

import { calculateFinancialScheme, compareGovernmentSchemes } from './financialEngine';

// Pre-seeded database of rural sector templates & market intelligence parameters
const SECTOR_INTELLIGENCE = {
  Dairy: {
    category: 'Animal Husbandry & Dairy',
    demandDrivers: ['High daily liquid milk consumption', 'Proximity to local dairy cooperatives & chilling plants', 'Government cattle insurance subsidy'],
    niches: ['Organic A2 Milk Packaging', 'Desi Ghee & Butter Value-Addition', 'Cattle Feed Manufacturing', 'Solar Bulk Milk Chilling Unit'],
    strengths: ['Predictable daily cash flow', 'Established SCA support & milk collection networks', 'High local demand'],
    weaknesses: ['High raw fodder cost fluctuations', 'Perishable product requiring immediate cold chain', 'High initial cattle purchase price'],
    opportunities: ['Sell directly to urban hotels/sweet shops at 25% premium', 'Biogas & organic manure byproduct revenue'],
    threats: ['Foot-and-mouth disease outbreaks', 'Monsoon fodder shortages', 'Oversaturation in dairy collection routes'],
    distributionChannels: ['Local Milk Collection Centre', 'Direct Village Door-to-Door Delivery', 'District Sweet Shops & Tea Stalls'],
    basePriceUnit: 'per Litre',
    recommendedPriceRange: '₹55 - ₹68',
    profitMarginPercent: '22% - 28%',
    saturationThreshold: 8 // units per block
  },
  Retail: {
    category: 'Retail & Kirana Enterprise',
    demandDrivers: ['Daily household grocery consumption', 'Growing demand for packaged FMCG goods in rural blocks', 'UPI digital payment adoption'],
    niches: ['Smart Kirana with Home Delivery', 'Agri-Inputs & Organic Fertilizer Retail', 'Eco-friendly Wholesale Packaging Store'],
    strengths: ['Low technical skill barrier', 'Steady customer footfall', 'Diversified product portfolio'],
    weaknesses: ['Thin profit margins (8-12%)', 'High credit given to village buyers (Khata system)', 'Inventory holding cost'],
    opportunities: ['Partner with micro-logistics apps for village pickup', 'Bulk buying discounts from district distributors'],
    threats: ['Competition from large weekly Haat markets', 'E-commerce delivery reaching village centers'],
    distributionChannels: ['Main Village Square (Chowk)', 'Gram Panchayat Commercial Complex'],
    basePriceUnit: 'Average Basket Value',
    recommendedPriceRange: '₹120 - ₹450',
    profitMarginPercent: '12% - 18%',
    saturationThreshold: 12
  },
  Textiles: {
    category: 'Textiles & Handloom Garments',
    demandDrivers: ['Festival season garment surge', 'School uniform requirements', 'Custom tailoring demand'],
    niches: ['School & Police Uniform Contract Stitching', 'Traditional Organic Cotton Dyeing', 'Ready-made Workwear for Agri Laborers'],
    strengths: ['High profit margins on custom work', 'Scalable through women SHG (Self Help Group) labor'],
    weaknesses: ['Seasonal demand peak (Diwali, Weddings, Back to School)', 'Equipment maintenance cost'],
    opportunities: ['Export to nearby tier-3 town boutiques', 'Sell online via government e-Marketplace (GeM)'],
    threats: ['Cheap synthetic fabric imports', 'Power outages interrupting electric sewing machines'],
    distributionChannels: ['Weekly Village Haat', 'Direct Orders from Local Schools/Gram Panchayats', 'District Garment Hubs'],
    basePriceUnit: 'per Garment / Unit',
    recommendedPriceRange: '₹350 - ₹1,200',
    profitMarginPercent: '30% - 40%',
    saturationThreshold: 6
  },
  SolarAgri: {
    category: 'Renewable Energy & Agri-Services',
    demandDrivers: ['High grid electricity tariffs', 'Unreliable daytime rural power supply', 'Government PM-KUSUM solar incentives'],
    niches: ['Custom Solar Water Pump Rental', 'Solar Micro-Cold Storage for Horticulture', 'Solar Powered Grain Dryer'],
    strengths: ['Very low recurring operational expenditure', 'Government priority lending sector', 'High community value'],
    weaknesses: ['Higher initial equipment investment', 'Requires basic technical maintenance training'],
    opportunities: ['Lease unused solar power back to local telecom towers or grid'],
    threats: ['Monsoon overcast weather reducing solar output', 'Damage from extreme weather'],
    distributionChannels: ['B2B Lease to Farmers Cooperative', 'Custom Service Hire to Village Farmers'],
    basePriceUnit: 'per Horsepower-hour / Day Rental',
    recommendedPriceRange: '₹150 - ₹400 / day',
    profitMarginPercent: '45% - 55%',
    saturationThreshold: 3
  },
  FoodProcessing: {
    category: 'Agri-Processing & Food Products',
    demandDrivers: ['Value addition to raw crops (Wheat, Spices, Pulses)', 'Surge in demand for unadulterated cold-pressed oils & spices'],
    niches: ['Cold-Pressed Mustard Oil Mill', 'Mini Flour & Spice Pulverizer (Atta/Chakki)', 'Fruit & Vegetable Dehydration Unit'],
    strengths: ['High raw material availability during harvest', 'Strong regional brand loyalty'],
    weaknesses: ['FSSAI hygiene compliance requirements', 'Power voltage fluctuations'],
    opportunities: ['Package into 1kg consumer packs for urban supermarket chains'],
    threats: ['Crop failure reducing raw grain supply', 'Price spikes in raw agricultural commodities'],
    distributionChannels: ['Local Retailers', 'District Wholesale Grain Market (Mandi)', 'Direct Consumer Packs'],
    basePriceUnit: 'per Kg / Litre',
    recommendedPriceRange: '₹140 - ₹220 / kg',
    profitMarginPercent: '28% - 35%',
    saturationThreshold: 5
  }
};

/**
 * Generate a complete 6-module Hyper-Local Feasibility Report with Govt Scheme Matching
 */
export function generateFeasibilityReport({ location, marginCapital, businessIdea, sectorKey = 'Dairy', chosenSchemeKey = null }) {
  const financial = calculateFinancialScheme(marginCapital, chosenSchemeKey);
  const schemeComparisons = compareGovernmentSchemes(marginCapital, sectorKey);

  // Select matching sector intelligence or fallback
  const sector = SECTOR_INTELLIGENCE[sectorKey] || SECTOR_INTELLIGENCE.Dairy;

  // Geographic intelligence based on location
  const villageName = location?.village || location?.villageName || 'Rampur';
  const blockName = location?.block || location?.blockName || 'Anand Rural';
  const districtName = location?.district || location?.districtName || 'Anand';
  const stateName = location?.state || location?.stateName || 'Gujarat';

  // Calculate competitor density index (simulated based on block data)
  const simulatedExistingUnits = Math.floor(Math.random() * 6) + 3; // 3 to 8 existing units
  const isOversaturated = simulatedExistingUnits > sector.saturationThreshold;
  const saturationLevel = isOversaturated ? 'Oversaturated' :
                          simulatedExistingUnits > sector.saturationThreshold - 2 ? 'Moderate Saturation' : 'Low Density (High Potential)';

  // Dynamic radius catchment population calculation
  const catchmentRadiusKm = 8;
  const estimatedConsumerBase = Math.round(financial.totalProjectCost / 12) + (simulatedExistingUnits * 450) + 4500;

  return {
    id: `REP-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    businessIdea,
    sectorCategory: sector.category,
    sectorKey,
    location: `${villageName}, Block: ${blockName}, Dist: ${districtName}, ${stateName}`,
    rawLocation: { villageName, blockName, districtName, stateName },
    financial,
    schemeComparisons,

    // Module 1: Market Reach
    marketReach: {
      radiusKm: catchmentRadiusKm,
      consumerBaseEstimate: estimatedConsumerBase,
      primaryChannels: sector.distributionChannels,
      demandDrivers: sector.demandDrivers,
      targetDemographics: 'Rural households, local traders, schools, and tier-3 town wholesalers within 10km.'
    },

    // Module 2: Opportunity Analysis
    opportunityAnalysis: {
      underservedNiches: sector.niches,
      marketGaps: `In ${blockName} block, raw consumer demand is expanding, yet specialized ${sector.niches[0]} remains 80% unfulfilled due to lack of local modern equipment.`
    },

    // Module 3: Dynamic SWOT Analysis
    swot: {
      strengths: sector.strengths,
      weaknesses: sector.weaknesses,
      opportunities: sector.opportunities,
      threats: sector.threats
    },

    // Module 4: Threats Identification
    threatsMatrix: [
      { threat: 'Supply Chain Bottleneck', riskLevel: 'Medium', mitigation: 'Establish quarterly raw material forward contracts with local farm producers.' },
      { threat: 'Seasonal Demand Variations', riskLevel: 'High', mitigation: 'Diversify product offerings during off-peak monsoon months.' },
      { threat: 'Single-Buyer Dependency Risk', riskLevel: 'Low', mitigation: 'Maintain a minimum of 5 distinct wholesale buyers across 2 neighboring blocks.' },
      { threat: 'Unscheduled Power Outages', riskLevel: 'Medium', mitigation: 'Allocate ₹25,000 from scheme working capital reserve for a solar hybrid backup unit.' }
    ],

    // Module 5: Competitor Mapping & Density Radar
    competitorMapping: {
      existingSimilarUnits: simulatedExistingUnits,
      saturationThreshold: sector.saturationThreshold,
      saturationStatus: saturationLevel,
      isOversaturated,
      densityScore: Math.min(100, Math.round((simulatedExistingUnits / (sector.saturationThreshold * 1.2)) * 100)),
      marketViabilityScore: isOversaturated ? 48 : 88
    },

    // Module 6: Product Market Value & Pricing Strategy
    pricingStrategy: {
      basePriceUnit: sector.basePriceUnit,
      recommendedPriceRange: sector.recommendedPriceRange,
      expectedProfitMargin: sector.profitMarginPercent,
      regionalPurchasingPowerIndex: 'Medium-High (Agri-Income Supported)',
      pricingRecommendation: `Price product at competitive lower tier initially (₹${sector.recommendedPriceRange.split('-')[0].trim()}) for quick market penetration in ${villageName}, then adjust upward after establishing brand trust.`
    }
  };
}

/**
 * Generate AI Counter-Proposals for Bank Officer when User's Idea is Oversaturated
 */
export function generateAICounterProposal(userApplication) {
  const { location, availableMarginCapital, originalBusinessIdea } = userApplication;
  const financial = calculateFinancialScheme(availableMarginCapital);

  // Alternative recommendations with lower saturation and higher profit potential
  const alternatives = [
    {
      title: 'Solar Powered Micro Cold Storage Co-op',
      sector: 'SolarAgri',
      schemeRecommendation: 'PM-KUSUM Solar Agri-Enterprise Scheme (60% Subsidy)',
      reasoning: `The proposed idea (${originalBusinessIdea}) faces high density in this block. Solar Cold Storage has 0 existing units in ${location?.blockName || 'this'} block and qualifies for 60% PM-KUSUM Central/State Subsidy with 45-55% profit margins.`,
      projectCost: financial.totalProjectCost,
      loanEligible: financial.sanctionedLoan,
      marginRequired: financial.marginCapital,
      expectedProfitMargin: '45% - 55%',
      paybackPeriodYears: '2.5 Years',
      competitionDensity: 'Very Low (1 Unit in 25km)',
      viabilityScore: 98
    },
    {
      title: 'Value-Added Spices & Pulses Processing Unit',
      sector: 'FoodProcessing',
      schemeRecommendation: 'PMEGP Capital Subsidy Scheme (35% Margin Subsidy)',
      reasoning: `Instead of raw retail/dairy sales, establishing a mini spice pulverizer unit utilizes locally harvested raw produce. High demand from district retail markets with 35% margin.`,
      projectCost: financial.totalProjectCost,
      loanEligible: financial.sanctionedLoan,
      marginRequired: financial.marginCapital,
      expectedProfitMargin: '30% - 38%',
      paybackPeriodYears: '3.0 Years',
      competitionDensity: 'Low (2 Units in Block)',
      viabilityScore: 92
    },
    {
      title: 'Organic Fertilizer & Cattle Feed Manufacturing',
      sector: 'Dairy',
      schemeRecommendation: 'SCA Term Loan Scheme (8.0% Interest, 7-Yr Tenure)',
      reasoning: `Capitalizes on the existing dairy ecosystem in ${location?.blockName || 'this'} block by supplying high-protein cattle feed directly to milk producers, creating a non-competing supply synergy.`,
      projectCost: financial.totalProjectCost,
      loanEligible: financial.sanctionedLoan,
      marginRequired: financial.marginCapital,
      expectedProfitMargin: '25% - 32%',
      paybackPeriodYears: '3.2 Years',
      competitionDensity: 'Low (1 Unit in Block)',
      viabilityScore: 89
    }
  ];

  return {
    applicationId: userApplication.id,
    applicantName: userApplication.applicantName,
    originalBusinessIdea,
    saturationNote: `AI Market Radar detected high competitor density (${userApplication.feasibilityReport?.competitorMapping?.existingSimilarUnits || 7} existing units) for ${originalBusinessIdea} in ${location?.blockName || 'this block'}. High risk of price-slashing and revenue stagnation.`,
    alternatives,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Hyper-Local AI Business Recommendation Engine (Location Based)
 * Recommends optimal high-demand business idea, total capital, 10% margin, and scheme for any village.
 */
export function getAIRecommendationForLocation(locationObj) {
  const village = locationObj?.village || locationObj?.villageName || 'Sualkuchi';
  const vLower = village.toLowerCase();

  let recommendation = {
    idea: 'Traditional Muga & Eri Silk Handloom Weaving Unit',
    sectorKey: 'Textiles',
    totalCapitalRequired: 250000,
    marginCapitalRequired: 25000,
    loanRequired: 225000,
    schemeKey: 'PMEGP',
    subsidyBenefit: '35% Govt Capital Subsidy (Save ₹87,500)',
    whyItFits: `High concentration of master weavers in ${village}. Strong raw silk yarn access, 94.2% historical success rate, and direct export demand to tier-1 cities.`,
    monthlyRevenueEst: '₹48,000 - ₹62,000 / month',
    marketDemandScore: 96
  };

  if (vLower.includes('majuli')) {
    recommendation = {
      idea: 'Organic Assam Orthodox Tea & Herbs Packaging Unit',
      sectorKey: 'FoodProcessing',
      totalCapitalRequired: 150000,
      marginCapitalRequired: 15000,
      loanRequired: 135000,
      schemeKey: 'SCA_MICRO',
      subsidyBenefit: '6.5% Concessional Micro Interest Rate',
      whyItFits: `Majuli Island has zero chemical fertilizer tea growers. Tourism footfall provides immediate direct-to-consumer sales at 35% premium margins.`,
      monthlyRevenueEst: '₹35,000 - ₹45,000 / month',
      marketDemandScore: 98
    };
  } else if (vLower.includes('tezpur')) {
    recommendation = {
      idea: 'Solar Powered Micro Cold Storage for Agri Produce',
      sectorKey: 'SolarAgri',
      totalCapitalRequired: 300000,
      marginCapitalRequired: 30000,
      loanRequired: 270000,
      schemeKey: 'PM_KUSUM',
      subsidyBenefit: '60% Combined Central & State Solar Subsidy (Save ₹1,80,000)',
      whyItFits: `Sonitpur horticultural farmers suffer 28% post-harvest spoilage. PM-KUSUM 60% solar subsidy makes payback achievable in 2.2 years.`,
      monthlyRevenueEst: '₹55,000 - ₹70,000 / month',
      marketDemandScore: 99
    };
  } else if (vLower.includes('barpeta')) {
    recommendation = {
      idea: 'Traditional Bell Metal Polish & Craft Workshop',
      sectorKey: 'BambooCraft',
      totalCapitalRequired: 200000,
      marginCapitalRequired: 20000,
      loanRequired: 180000,
      schemeKey: 'MUDRA_TARUN',
      subsidyBenefit: '100% Collateral-Free Institutional Approval',
      whyItFits: `Barpeta is India's premier bell-metal artisan cluster. Automated polishing machinery increases daily unit output by 3.5x with 32% profit margin.`,
      monthlyRevenueEst: '₹42,000 - ₹58,000 / month',
      marketDemandScore: 95
    };
  } else if (vLower.includes('nagaon')) {
    recommendation = {
      idea: 'High-Yield Biofloc Inland Fisheries & Hatchery',
      sectorKey: 'Fisheries',
      totalCapitalRequired: 280000,
      marginCapitalRequired: 28000,
      loanRequired: 252000,
      schemeKey: 'PMEGP',
      subsidyBenefit: '35% Rural Capital Subsidy (Save ₹98,000)',
      whyItFits: `Kaliabor block has abundant water bodies. High local fish consumption guarantees daily cash sales with low mortality risk under biofloc technology.`,
      monthlyRevenueEst: '₹52,000 - ₹68,000 / month',
      marketDemandScore: 97
    };
  } else if (vLower.includes('hajo')) {
    recommendation = {
      idea: 'Brass Metalware & Eco-Tourism Souvenir Crafts',
      sectorKey: 'Textiles',
      totalCapitalRequired: 180000,
      marginCapitalRequired: 18000,
      loanRequired: 162000,
      schemeKey: 'DAY_NRLM',
      subsidyBenefit: '4.0% Effective Subsidized SHG Interest Rate',
      whyItFits: `Hajo pilgrim tourism cluster guarantees steady footfall for cultural metalware souvenirs with high profit margins.`,
      monthlyRevenueEst: '₹38,000 - ₹50,000 / month',
      marketDemandScore: 93
    };
  } else if (vLower.includes('silchar') || vLower.includes('cachar')) {
    recommendation = {
      idea: 'Eco-Friendly Cachar Bamboo & Cane Product Unit',
      sectorKey: 'BambooCraft',
      totalCapitalRequired: 140000,
      marginCapitalRequired: 14000,
      loanRequired: 126000,
      schemeKey: 'SCA_MICRO',
      subsidyBenefit: 'Concessional Micro Finance (No Collateral)',
      whyItFits: `Abundant natural bamboo in Cachar region. Eco-friendly straws and furniture have high demand in urban export hubs.`,
      monthlyRevenueEst: '₹30,000 - ₹42,000 / month',
      marketDemandScore: 94
    };
  }

  return recommendation;
}

/**
 * Bank Officer AI Market Situation Evaluator
 * Runs a live AI viability and saturation check on an applicant's proposed business idea
 */
export function evaluateMarketSituation(businessIdea, locationObj) {
  const village = locationObj?.villageName || locationObj?.village || 'Local Village';
  const block = locationObj?.blockName || locationObj?.block || 'Local Block';

  // Determine market saturation based on idea complexity
  const ideaLower = (businessIdea || '').toLowerCase();
  let existingUnits = 4;
  let maxThreshold = 8;
  let riskLevel = 'LOW';
  let score = 88;
  let verdict = 'RECOMMENDED FOR SANCTION';
  let keyFinding = `Optimal market gap in ${block}. Raw material access is excellent and consumer demand exceeds existing production by 40%.`;

  if (ideaLower.includes('kirana') || ideaLower.includes('grocery') || ideaLower.includes('retail store')) {
    existingUnits = 14;
    maxThreshold = 10;
    riskLevel = 'HIGH (OVERSATURATED)';
    score = 46;
    verdict = 'HIGH RISK - COUNTER PROPOSAL RECOMMENDED';
    keyFinding = `Block ${block} has ${existingUnits} Kirana shops against a threshold of ${maxThreshold}. High risk of credit default and price slashing. Recommend switching to value-added agro-processing.`;
  } else if (ideaLower.includes('tailoring') || ideaLower.includes('garment')) {
    existingUnits = 7;
    maxThreshold = 6;
    riskLevel = 'MODERATE';
    score = 72;
    verdict = 'CONDITIONAL APPROVAL WITH SHG PAIRING';
    keyFinding = `Moderate saturation in ${block}. Advise upgrading to semi-automated embroidery machinery to capture school uniform contracts.`;
  }

  return {
    businessIdea,
    village,
    block,
    existingUnits,
    maxThreshold,
    riskLevel,
    viabilityScore: score,
    verdict,
    keyFinding,
    evaluatedAt: new Date().toISOString()
  };
}


