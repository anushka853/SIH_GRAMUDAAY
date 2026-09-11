// Financial Engine for GramUday AI
// Implements 10% Margin Money & 90% Loan Allocation Scheme Rules + Government Predefined Schemes Matching

/**
 * Predefined Government Schemes Database with Official Guidelines & Parameters
 */
export const PREDEFINED_GOVT_SCHEMES = {
  SCA_MICRO: {
    key: 'SCA_MICRO',
    name: 'SCA Micro Finance Scheme',
    category: 'Concessional Credit',
    maxProjectCost: 140000,
    interestRate: 6.5,
    tenureYears: 3,
    moratoriumMonths: 3,
    subsidyPercent: 0,
    collateralRequired: false,
    description: 'Concessional micro credit scheme for rural micro-enterprises with project cost ≤ ₹1.40 Lakh.'
  },
  SCA_TERM: {
    key: 'SCA_TERM',
    name: 'SCA Term Loan Scheme',
    category: 'Concessional Credit',
    maxProjectCost: 5000000,
    interestRate: 8.0,
    tenureYears: 7,
    moratoriumMonths: 6,
    subsidyPercent: 0,
    collateralRequired: false,
    description: 'Concessional term loan scheme for project cost between ₹1.40 Lakh and ₹50.00 Lakh.'
  },
  PMEGP: {
    key: 'PMEGP',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    category: 'Central Capital Subsidy Scheme',
    maxProjectCost: 5000000,
    interestRate: 8.5,
    tenureYears: 7,
    moratoriumMonths: 6,
    subsidyPercent: 35, // 35% Margin Money Subsidy for Special/Rural Category
    collateralRequired: false, // Up to ₹10L under CGTMSE
    description: 'Credit-linked capital subsidy scheme providing up to 35% government subsidy for rural enterprises.'
  },
  MUDRA_TARUN: {
    key: 'MUDRA_TARUN',
    name: 'Pradhan Mantri MUDRA Yojana (Tarun / Kishore)',
    category: 'Collateral-Free Credit',
    maxProjectCost: 1000000,
    interestRate: 8.25,
    tenureYears: 5,
    moratoriumMonths: 6,
    subsidyPercent: 0,
    collateralRequired: false,
    description: 'Institutional collateral-free financing up to ₹10 Lakhs for micro-manufacturing and services.'
  },
  DAY_NRLM: {
    key: 'DAY_NRLM',
    name: 'DAY-NRLM (Aajeevika SHG Concessional Credit)',
    category: 'Interest Subvention Scheme',
    maxProjectCost: 2000000,
    interestRate: 4.0, // 7% base with 3% interest subvention for prompt repayment
    tenureYears: 5,
    moratoriumMonths: 6,
    subsidyPercent: 0,
    collateralRequired: false,
    description: 'Subsidized loan at effective 4% interest rate for rural women SHGs and artisan collectives.'
  },
  PM_KUSUM: {
    key: 'PM_KUSUM',
    name: 'PM-KUSUM Solar Agri-Enterprise Scheme',
    category: 'Renewable Subsidy Scheme',
    maxProjectCost: 3000000,
    interestRate: 7.5,
    tenureYears: 7,
    moratoriumMonths: 6,
    subsidyPercent: 60, // 60% combined Central + State Subsidy
    collateralRequired: false,
    description: 'Solarization subsidy covering up to 60% project cost for solar water pumping & cold storage.'
  }
};

/**
 * Calculates financial structure and scheme routing based on margin capital & scheme choice
 * @param {number} marginCapital - Available beneficiary margin money (e.g. ₹100,000)
 * @param {string} schemeKey - Optional specific scheme key (defaults to auto-routed scheme)
 * @returns {Object} Complete financial breakdown and scheme routing details
 */
export function calculateFinancialScheme(marginCapital, schemeKey = null) {
  const margin = Math.max(1000, Number(marginCapital) || 0);
  
  // Mathematical Algorithm Rule 1: Total Feasible Project Cost = Margin Capital / 0.10 (10% Contribution)
  const totalProjectCost = Math.round(margin / 0.10);
  
  // Mathematical Algorithm Rule 2: Maximum Loan Eligibility = 90% of Total Project Cost
  const maxLoanAmount = Math.round(totalProjectCost * 0.90);

  // Default Auto-Routing Rule if no specific scheme is chosen:
  // If Project Cost <= ₹1.40 Lakh -> Micro Finance Scheme
  // If ₹1.40 Lakh < Project Cost <= ₹50 Lakh -> Term Loan Scheme
  let autoRoutedSchemeKey = 'SCA_MICRO';
  if (totalProjectCost > 140000) {
    autoRoutedSchemeKey = 'SCA_TERM';
  }

  const selectedScheme = PREDEFINED_GOVT_SCHEMES[schemeKey] || PREDEFINED_GOVT_SCHEMES[autoRoutedSchemeKey];

  const schemeType = selectedScheme.key;
  const schemeName = selectedScheme.name;
  const interestRate = selectedScheme.interestRate;
  const totalTenureYears = selectedScheme.tenureYears;
  const totalQuarters = totalTenureYears * 4;
  const moratoriumMonths = selectedScheme.moratoriumMonths;
  const moratoriumQuarters = Math.ceil(moratoriumMonths / 3);

  // Government Subsidy Calculation ($S = C \times \text{Subsidy\%}$)
  const subsidyPercent = selectedScheme.subsidyPercent || 0;
  const govtSubsidyAmount = Math.round(totalProjectCost * (subsidyPercent / 100));

  // Net Disbursed Loan after Subsidy Deduction ($L_{net} = L_{max} - S$)
  const sanctionedLoan = Math.max(10000, maxLoanAmount - govtSubsidyAmount);

  // EMI Amortization Schedule Calculation (Quarterly Basis)
  // Quarterly Rate $r = \frac{\text{Annual Interest Rate}}{4 \times 100}$
  const quarterlyRate = interestRate / 100 / 4;
  const repaymentQuarters = Math.max(1, totalQuarters - moratoriumQuarters);

  // Quarterly EMI formula: $E = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$
  let quarterlyEMI = 0;
  if (quarterlyRate > 0 && repaymentQuarters > 0) {
    quarterlyEMI =
      (sanctionedLoan * quarterlyRate * Math.pow(1 + quarterlyRate, repaymentQuarters)) /
      (Math.pow(1 + quarterlyRate, repaymentQuarters) - 1);
  }

  // Moratorium interest per quarter (Interest-only during grace)
  const moratoriumQuarterlyInterest = sanctionedLoan * quarterlyRate;

  // Total Interest Paid over entire tenure
  const totalRepaymentAmount = (quarterlyEMI * repaymentQuarters) + (moratoriumQuarterlyInterest * moratoriumQuarters);
  const totalInterestPaid = Math.max(0, totalRepaymentAmount - sanctionedLoan);

  // Working Capital and Operational Reserve Recommendations
  const recommendedWorkingCapital = Math.round(totalProjectCost * 0.20); // 20% operational reserve
  const assetInvestmentCost = Math.round(totalProjectCost * 0.80); // 80% capex

  // Detailed Quarterly Payment Schedule
  const schedule = [];
  let remainingPrincipal = sanctionedLoan;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    
    if (isMoratorium) {
      const interestPayment = remainingPrincipal * quarterlyRate;
      schedule.push({
        quarter: q,
        periodName: `Q${q} (Moratorium Month ${q * 3 - 2}-${q * 3})`,
        isMoratorium: true,
        principalPayment: 0,
        interestPayment: Math.round(interestPayment),
        totalEMI: Math.round(interestPayment),
        remainingPrincipal: Math.round(remainingPrincipal)
      });
    } else {
      const interestPayment = remainingPrincipal * quarterlyRate;
      const principalPayment = quarterlyEMI - interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);

      schedule.push({
        quarter: q,
        periodName: `Q${q} (Repayment Quarter ${q - moratoriumQuarters})`,
        isMoratorium: false,
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        totalEMI: Math.round(quarterlyEMI),
        remainingPrincipal: Math.round(remainingPrincipal)
      });
    }
  }

  return {
    marginCapital: margin,
    totalProjectCost,
    maxLoanAmount,
    govtSubsidyAmount,
    subsidyPercent,
    sanctionedLoan,
    schemeType,
    schemeName,
    schemeDetails: selectedScheme,
    interestRate,
    totalTenureYears,
    totalQuarters,
    moratoriumMonths,
    moratoriumQuarters,
    quarterlyEMI: Math.round(quarterlyEMI),
    moratoriumQuarterlyInterest: Math.round(moratoriumQuarterlyInterest),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalRepaymentAmount: Math.round(totalRepaymentAmount),
    recommendedWorkingCapital,
    assetInvestmentCost,
    schedule
  };
}

/**
 * Compare side-by-side predefined government schemes for Bank Officer AI Evaluation Desk
 */
export function compareGovernmentSchemes(marginCapital, sectorKey = 'Dairy') {
  const margin = Number(marginCapital) || 100000;
  const projectCost = margin / 0.10;

  const schemeKeys = Object.keys(PREDEFINED_GOVT_SCHEMES);

  return schemeKeys.map((key) => {
    const calc = calculateFinancialScheme(margin, key);
    const scheme = PREDEFINED_GOVT_SCHEMES[key];

    // Compute AI Suitability Score (0-100) based on project cost and sector match
    let suitabilityScore = 80;
    let matchReasons = [];

    if (key === 'PMEGP' && projectCost <= 5000000) {
      suitabilityScore = 96;
      matchReasons.push('High 35% capital subsidy savings for rural unit');
    } else if (key === 'PM_KUSUM' && (sectorKey === 'SolarAgri' || sectorKey === 'Dairy')) {
      suitabilityScore = 98;
      matchReasons.push('60% combined solar subsidy for agri & cooling');
    } else if (key === 'SCA_MICRO' && projectCost <= 140000) {
      suitabilityScore = 94;
      matchReasons.push('Optimal 6.5% interest concessional micro credit rate');
    } else if (key === 'DAY_NRLM' && sectorKey === 'Textiles') {
      suitabilityScore = 92;
      matchReasons.push('4% effective interest rate with SHG subvention');
    } else if (key === 'MUDRA_TARUN' && projectCost <= 1000000) {
      suitabilityScore = 88;
      matchReasons.push('100% collateral-free institutional approval');
    } else if (key === 'SCA_TERM') {
      suitabilityScore = 85;
      matchReasons.push('Standard 7-year tenure with 6-month moratorium');
    }

    return {
      schemeKey: key,
      schemeName: scheme.name,
      category: scheme.category,
      suitabilityScore,
      matchReasons,
      projectCost: calc.totalProjectCost,
      marginCapital: calc.marginCapital,
      govtSubsidyAmount: calc.govtSubsidyAmount,
      sanctionedLoan: calc.sanctionedLoan,
      interestRate: calc.interestRate,
      tenureYears: calc.totalTenureYears,
      moratoriumMonths: calc.moratoriumMonths,
      quarterlyEMI: calc.quarterlyEMI,
      totalInterestPaid: calc.totalInterestPaid
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

/**
 * Format Indian currency string (e.g. ₹1,00,000)
 */
export function formatINR(amount) {
  if (isNaN(amount) || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

