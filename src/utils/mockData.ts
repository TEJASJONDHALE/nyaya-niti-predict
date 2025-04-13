
export const caseTypes = [
  'Criminal - Theft',
  'Civil - Property Dispute',
  'Family - Divorce',
  'Contract - Breach',
  'Employment - Wrongful Termination',
];

export const courts = [
  'Supreme Court',
  'High Court',
  'District Court',
  'Magistrate Court',
  'Tribunal',
];

export type PredictionFactor = {
  factor: string;
  importance: number;
  reference?: string;
};

export type PredictionResult = {
  outcome: string;
  confidence: number;
  explanation: string;
  factors: PredictionFactor[];
};

export const sampleCases = [
  {
    id: '1',
    caseNumber: 'CR-2023-1234',
    court: 'District Court',
    caseType: 'Criminal - Theft',
    outcome: 'Conviction',
    description: 'A case of theft with strong evidence leading to conviction.',
    witnessCount: 4,
    duration: 90,
  },
  {
    id: '2',
    caseNumber: 'CV-2023-5678',
    court: 'High Court',
    caseType: 'Civil - Property Dispute',
    outcome: 'Settlement',
    description: 'A property dispute case settled out of court.',
    witnessCount: 2,
    duration: 180,
  },
  {
    id: '3',
    caseNumber: 'FM-2023-9012',
    court: 'Family Court',
    caseType: 'Family - Divorce',
    outcome: 'Settlement',
    description: 'A divorce case with mutual agreement on settlement.',
    witnessCount: 0,
    duration: 120,
  },
];

// Add the missing statisticsData export
export const statisticsData = {
  casesByOutcome: {
    'Conviction': 350,
    'Settlement': 460,
    'Acquittal': 190
  },
  averageDurationByType: {
    'Criminal - Theft': 120,
    'Civil - Property Dispute': 180,
    'Family - Divorce': 90,
    'Contract - Breach': 145,
    'Employment - Wrongful Termination': 160
  },
  accuracyByCourtType: {
    'Supreme Court': 0.91,
    'High Court': 0.87,
    'District Court': 0.82,
    'Magistrate Court': 0.79,
    'Tribunal': 0.85
  },
  topFactors: [
    { factor: 'Evidence Strength', importance: 0.85 },
    { factor: 'Witness Count', importance: 0.72 },
    { factor: 'Prior Precedents', importance: 0.65 },
    { factor: 'Legal Representation', importance: 0.58 }
  ]
};

// Mock function to generate predictions when Supabase is not available
export const mockPrediction = (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string
): PredictionResult => {
  // Simple logic to determine outcome based on inputs
  let outcome = 'Settlement';
  let confidence = 0.5;
  
  // More witnesses typically increase chances of conviction
  if (witnessCount > 5) {
    outcome = 'Conviction';
    confidence = 0.7;
  } 
  // Strong evidence with few witnesses often leads to settlement
  else if (evidenceStrength === 'Strong' && witnessCount < 3) {
    outcome = 'Settlement';
    confidence = 0.8;
  } 
  // Weak evidence often leads to acquittal
  else if (evidenceStrength === 'Weak') {
    outcome = 'Acquittal';
    confidence = 0.6;
  }
  
  // Adjust based on case type
  if (caseType === 'Criminal - Theft') {
    confidence += 0.1;
  } else if (caseType === 'Civil - Property Dispute') {
    outcome = outcome === 'Conviction' ? 'Settlement' : outcome;
  }
  
  // Ensure confidence is between 0 and 1
  confidence = Math.min(Math.max(confidence, 0.3), 0.9);
  
  // Generate mock explanation
  const explanation = `Based on the ${witnessCount} witnesses and ${evidenceStrength.toLowerCase()} evidence provided in this ${caseType.toLowerCase()} case, our model predicts a ${outcome.toLowerCase()} outcome with ${Math.round(confidence * 100)}% confidence.`;
  
  // Generate mock factors with references
  const factors: PredictionFactor[] = [
    {
      factor: 'Witness Count',
      importance: witnessCount > 3 ? 0.7 : 0.3,
      reference: witnessCount > 3 ? 'Case precedents show that over 3 witnesses significantly increase conviction rates.' : 'Cases with fewer witnesses tend to have lower conviction rates.'
    },
    {
      factor: 'Evidence Strength',
      importance: evidenceStrength === 'Strong' ? 0.8 : evidenceStrength === 'Moderate' ? 0.5 : 0.2,
      reference: evidenceStrength === 'Strong' ? 'Strong evidence is the most important factor in determining case outcomes.' : 'Weak evidence significantly reduces conviction probability.'
    },
    {
      factor: 'Case Type Precedents',
      importance: 0.6,
      reference: `Historical data shows ${caseType} cases have distinct patterns in judicial outcomes.`
    },
    {
      factor: 'Jurisdictional Patterns',
      importance: 0.4,
      reference: 'Court-specific tendencies influence case resolutions across similar case types.'
    }
  ];
  
  return {
    outcome,
    confidence,
    explanation,
    factors
  };
};
