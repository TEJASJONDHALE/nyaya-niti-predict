
export interface Case {
  id: string;
  caseNumber: string;
  court: string;
  caseType: string;
  filingDate: string;
  duration: number;
  witnessCount: number;
  judgeExperience: number;
  outcome: 'Conviction' | 'Acquittal' | 'Settlement';
  description: string;
}

export interface PredictionResult {
  outcome: 'Conviction' | 'Acquittal' | 'Settlement';
  confidence: number;
  factors: {
    factor: string;
    importance: number;
  }[];
  explanation: string;
}

export const sampleCases: Case[] = [
  {
    id: '1',
    caseNumber: 'CR-2023-1234',
    court: 'Delhi High Court',
    caseType: 'Criminal - Theft',
    filingDate: '2023-01-15',
    duration: 95,
    witnessCount: 4,
    judgeExperience: 12,
    outcome: 'Conviction',
    description: 'Theft case with multiple eyewitnesses and strong evidence.'
  },
  {
    id: '2',
    caseNumber: 'CR-2023-2345',
    court: 'Mumbai High Court',
    caseType: 'Criminal - Assault',
    filingDate: '2023-02-10',
    duration: 145,
    witnessCount: 2,
    judgeExperience: 8,
    outcome: 'Acquittal',
    description: 'Assault case with conflicting testimonies and insufficient evidence.'
  },
  {
    id: '3',
    caseNumber: 'CR-2023-3456',
    court: 'Chennai High Court',
    caseType: 'Criminal - Fraud',
    filingDate: '2023-03-05',
    duration: 210,
    witnessCount: 6,
    judgeExperience: 15,
    outcome: 'Conviction',
    description: 'Financial fraud case with documentary evidence and expert witness testimony.'
  },
  {
    id: '4',
    caseNumber: 'CR-2023-4567',
    court: 'Kolkata High Court',
    caseType: 'Criminal - Drug Possession',
    filingDate: '2023-04-20',
    duration: 75,
    witnessCount: 3,
    judgeExperience: 5,
    outcome: 'Settlement',
    description: 'Drug possession case resolved through plea bargain.'
  },
  {
    id: '5',
    caseNumber: 'CR-2023-5678',
    court: 'Bangalore High Court',
    caseType: 'Criminal - Domestic Violence',
    filingDate: '2023-05-12',
    duration: 180,
    witnessCount: 3,
    judgeExperience: 10,
    outcome: 'Conviction',
    description: 'Domestic violence case with medical evidence and victim testimony.'
  },
];

export const caseTypes = [
  'Criminal - Theft',
  'Criminal - Assault',
  'Criminal - Fraud',
  'Criminal - Drug Possession',
  'Criminal - Domestic Violence',
  'Criminal - Murder',
  'Criminal - Cybercrime',
];

export const courts = [
  'Supreme Court',
  'Delhi High Court',
  'Mumbai High Court',
  'Chennai High Court',
  'Kolkata High Court',
  'Bangalore High Court',
  'Hyderabad High Court',
];

export const mockPrediction = (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string
): PredictionResult => {
  // Simple mock prediction logic based on inputs
  let outcome: 'Conviction' | 'Acquittal' | 'Settlement';
  let confidence: number;
  
  if (evidenceStrength === 'Strong' && witnessCount >= 3) {
    outcome = 'Conviction';
    confidence = 0.85 + (Math.random() * 0.1);
  } else if (evidenceStrength === 'Weak' || witnessCount < 2) {
    outcome = 'Acquittal';
    confidence = 0.75 + (Math.random() * 0.15);
  } else {
    // Mixed evidence cases
    const rand = Math.random();
    if (rand < 0.4) {
      outcome = 'Conviction';
      confidence = 0.6 + (Math.random() * 0.15);
    } else if (rand < 0.8) {
      outcome = 'Acquittal';
      confidence = 0.65 + (Math.random() * 0.1);
    } else {
      outcome = 'Settlement';
      confidence = 0.7 + (Math.random() * 0.2);
    }
  }

  // Generate factors based on the case
  const factors = [];
  
  if (witnessCount >= 3) {
    factors.push({
      factor: 'Multiple witness testimonies',
      importance: 0.8 + (Math.random() * 0.2),
    });
  } else {
    factors.push({
      factor: 'Limited witness testimonies',
      importance: 0.7 + (Math.random() * 0.2),
    });
  }

  factors.push({
    factor: `${evidenceStrength} documentary evidence`,
    importance: evidenceStrength === 'Strong' ? 0.9 : evidenceStrength === 'Moderate' ? 0.6 : 0.3,
  });

  if (caseType.includes('Theft') || caseType.includes('Fraud')) {
    factors.push({
      factor: 'Financial crime precedents',
      importance: 0.5 + (Math.random() * 0.3),
    });
  } else if (caseType.includes('Violence') || caseType.includes('Assault')) {
    factors.push({
      factor: 'Physical evidence quality',
      importance: 0.6 + (Math.random() * 0.3),
    });
  } else {
    factors.push({
      factor: 'Case law precedents',
      importance: 0.4 + (Math.random() * 0.4),
    });
  }

  // Sort factors by importance
  factors.sort((a, b) => b.importance - a.importance);

  // Generate explanation based on outcome
  let explanation = '';
  if (outcome === 'Conviction') {
    explanation = `Based on the ${evidenceStrength.toLowerCase()} evidence and ${witnessCount} witness testimonies, this ${caseType.toLowerCase()} case is likely to result in a conviction. The strength of documentary evidence and witness credibility are key factors.`;
  } else if (outcome === 'Acquittal') {
    explanation = `The ${evidenceStrength.toLowerCase()} evidence may not be sufficient to meet the burden of proof for this ${caseType.toLowerCase()} case. Limited witness testimony and potential evidence challenges suggest an acquittal is likely.`;
  } else {
    explanation = `Given the case complexity and evidence profile, this ${caseType.toLowerCase()} case may be resolved through settlement. Considering the mixed strength of evidence and moderate witness support, both parties may find settlement preferable to a lengthy trial.`;
  }

  return {
    outcome,
    confidence,
    factors: factors.slice(0, 3),
    explanation
  };
};

export const statisticsData = {
  casesByOutcome: {
    Conviction: 452,
    Acquittal: 323,
    Settlement: 225
  },
  averageDurationByType: {
    'Criminal - Theft': 120,
    'Criminal - Assault': 145,
    'Criminal - Fraud': 210,
    'Criminal - Drug Possession': 90,
    'Criminal - Domestic Violence': 180,
    'Criminal - Murder': 365,
    'Criminal - Cybercrime': 240
  },
  accuracyByCourtType: {
    'Supreme Court': 0.92,
    'High Courts': 0.87,
    'District Courts': 0.83,
    'Special Courts': 0.85
  },
  topFactors: [
    { factor: 'Witness Count', importance: 0.85 },
    { factor: 'Evidence Quality', importance: 0.82 },
    { factor: 'Judge Experience', importance: 0.65 },
    { factor: 'Case Duration', importance: 0.58 },
    { factor: 'Court Location', importance: 0.45 }
  ]
};
