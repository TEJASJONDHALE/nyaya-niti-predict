export const caseTypes = [
  'Criminal - Theft',
  'Criminal - Assault',
  'Criminal - Fraud',
  'Criminal - Homicide',
  'Criminal - Drug Possession',
];

export const courts = [
  'Supreme Court',
  'High Court',
  'District Court',
  'Magistrate Court',
  'Special Criminal Court',
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
    firNumber: 'FIR-123/2023',
    firSection: 'IPC 379',
    firDate: '2023-01-15'
  },
  {
    id: '2',
    caseNumber: 'CR-2023-5678',
    court: 'High Court',
    caseType: 'Criminal - Assault',
    outcome: 'Acquittal',
    description: 'An assault case with weak evidence leading to acquittal.',
    witnessCount: 2,
    duration: 180,
    firNumber: 'FIR-456/2023',
    firSection: 'IPC 323',
    firDate: '2023-02-20'
  },
  {
    id: '3',
    caseNumber: 'CR-2023-9012',
    court: 'Magistrate Court',
    caseType: 'Criminal - Drug Possession',
    outcome: 'Conviction',
    description: 'A drug possession case with strong evidence leading to conviction.',
    witnessCount: 1,
    duration: 60,
    firNumber: 'FIR-789/2023',
    firSection: 'NDPS Act 20',
    firDate: '2023-03-10'
  }
];

// Add similar cases with FIR details
export const similarCases = [
  {
    id: 'SC-1',
    title: 'State vs. John Doe',
    court: 'District Court',
    date: '2023-01-15',
    outcome: 'Conviction',
    crimeType: 'Theft',
    relevance: 85,
    keyFacts: ['Stolen property worth ₹50,000', 'Multiple witnesses', 'CCTV evidence'],
    firNumber: 'FIR-123/2023',
    firSection: 'IPC 379',
    firDate: '2023-01-15'
  },
  {
    id: 'SC-2',
    title: 'State vs. Jane Smith',
    court: 'High Court',
    date: '2023-02-20',
    outcome: 'Acquittal',
    crimeType: 'Assault',
    relevance: 75,
    keyFacts: ['Minor injuries', 'Self-defense claim', 'No prior record'],
    firNumber: 'FIR-456/2023',
    firSection: 'IPC 323',
    firDate: '2023-02-20'
  },
  {
    id: 'SC-3',
    title: 'State vs. Robert Johnson',
    court: 'Magistrate Court',
    date: '2023-03-10',
    outcome: 'Conviction',
    crimeType: 'Drug Possession',
    relevance: 90,
    keyFacts: ['Commercial quantity', 'Previous convictions', 'Police raid'],
    firNumber: 'FIR-789/2023',
    firSection: 'NDPS Act 20',
    firDate: '2023-03-10'
  },
  {
    id: 'SC-4',
    title: 'State vs. Sarah Williams',
    court: 'District Court',
    date: '2023-04-05',
    outcome: 'Conviction',
    crimeType: 'Fraud',
    relevance: 80,
    keyFacts: ['Financial fraud', 'Multiple victims', 'Digital evidence'],
    firNumber: 'FIR-101/2023',
    firSection: 'IPC 420',
    firDate: '2023-04-05'
  },
  {
    id: 'SC-5',
    title: 'State vs. Michael Brown',
    court: 'High Court',
    date: '2023-05-12',
    outcome: 'Acquittal',
    crimeType: 'Homicide',
    relevance: 70,
    keyFacts: ['Self-defense', 'No premeditation', 'Single witness'],
    firNumber: 'FIR-202/2023',
    firSection: 'IPC 302',
    firDate: '2023-05-12'
  }
];

// Add the missing statisticsData export
export const statisticsData = {
  casesByOutcome: {
    'Conviction': 650,
    'Settlement': 120,
    'Acquittal': 230
  },
  averageDurationByType: {
    'Criminal - Theft': 95,
    'Criminal - Assault': 140,
    'Criminal - Fraud': 180,
    'Criminal - Homicide': 230,
    'Criminal - Drug Possession': 75
  },
  accuracyByCourtType: {
    'Supreme Court': 0.91,
    'High Court': 0.87,
    'District Court': 0.82,
    'Magistrate Court': 0.79,
    'Special Criminal Court': 0.85
  },
  topFactors: [
    { factor: 'FIR Section', importance: 0.85 },
    { factor: 'Witness Count', importance: 0.72 },
    { factor: 'Prior Criminal Record', importance: 0.68 },
    { factor: 'Police Testimony', importance: 0.62 }
  ]
};

// Mock function to generate predictions when Supabase is not available
export const mockPrediction = (
  caseType: string,
  witnessCount: number,
  firSection: string
): PredictionResult => {
  // Simple logic to determine outcome based on inputs
  let outcome = 'Settlement';
  let confidence = 0.5;
  
  // More witnesses typically increase chances of conviction
  if (witnessCount > 5) {
    outcome = 'Conviction';
    confidence = 0.7;
  } 
  // Strong FIR sections often lead to conviction
  else if (firSection.includes('IPC 302') || firSection.includes('IPC 376')) {
    outcome = 'Conviction';
    confidence = 0.8;
  } 
  // Weak FIR sections often lead to acquittal
  else if (firSection.includes('IPC 323') || firSection.includes('IPC 504')) {
    outcome = 'Acquittal';
    confidence = 0.6;
  }
  
  // For criminal cases, adjust outcomes
  if (caseType.includes('Criminal')) {
    // Criminal cases don't typically end in settlement
    if (outcome === 'Settlement') {
      outcome = 'Conviction';
      confidence = 0.6;
    }
    
    // Specific adjustments based on crime type
    if (caseType.includes('Theft')) {
      confidence += 0.1;
    } else if (caseType.includes('Homicide')) {
      outcome = witnessCount > 3 ? 'Conviction' : 'Acquittal';
      confidence += 0.15;
    } else if (caseType.includes('Drug')) {
      outcome = 'Conviction';
      confidence += 0.2;
    }
  }
  
  // Ensure confidence is between 0 and 1
  confidence = Math.min(Math.max(confidence, 0.3), 0.9);
  
  // Generate mock explanation
  const explanation = `Based on analysis of 10,000+ similar criminal cases, with ${witnessCount} witnesses and FIR registered under ${firSection} in this ${caseType.toLowerCase()} case, our AI model predicts a ${outcome.toLowerCase()} outcome with ${Math.round(confidence * 100)}% confidence.`;
  
  // Generate mock factors specific to criminal cases
  const factors: PredictionFactor[] = [
    {
      factor: 'Witness Count',
      importance: witnessCount > 3 ? 0.7 : 0.3,
      reference: witnessCount > 3 ? 'Based on 237 similar criminal cases, more than 3 witnesses significantly increases conviction rates by 42%.' : 'Analysis of 185 cases shows fewer witnesses correlate with 37% lower conviction rates.'
    },
    {
      factor: 'FIR Section',
      importance: firSection.includes('IPC 302') || firSection.includes('IPC 376') ? 0.8 : 0.5,
      reference: firSection.includes('IPC 302') || firSection.includes('IPC 376') ? 'In 312 analyzed criminal cases with serious charges, 78% resulted in conviction.' : 'Based on 254 cases, less serious charges led to acquittal in 68% of instances.'
    }
  ];
  
  // Add case-specific factors
  if (caseType.includes('Theft')) {
    factors.push({
      factor: 'Value of Stolen Property',
      importance: 0.65,
      reference: 'Analysis of 178 theft cases shows correlation between value of stolen property and sentencing severity.'
    });
  } else if (caseType.includes('Assault')) {
    factors.push({
      factor: 'Injury Severity',
      importance: 0.75,
      reference: 'In 204 assault cases, severity of injury was the primary factor in 82% of convictions.'
    });
  } else if (caseType.includes('Fraud')) {
    factors.push({
      factor: 'Financial Impact',
      importance: 0.7,
      reference: 'Analysis of 156 fraud cases shows financial impact directly correlates with conviction likelihood.'
    });
  } else if (caseType.includes('Homicide')) {
    factors.push({
      factor: 'Forensic Evidence',
      importance: 0.85,
      reference: 'In 98 analyzed homicide cases, forensic evidence quality determined outcome in 76% of cases.'
    });
  } else if (caseType.includes('Drug')) {
    factors.push({
      factor: 'Quantity Possessed',
      importance: 0.8,
      reference: 'Analysis of 267 drug possession cases shows quantity is the primary determining factor in 89% of convictions.'
    });
  }
  
  // Add general criminal justice factor
  factors.push({
    factor: 'Prior Criminal Record',
    importance: 0.6,
    reference: 'Statistical analysis of 432 cases shows prior criminal record increases conviction likelihood by 57%.'
  });
  
  return {
    outcome,
    confidence,
    explanation,
    factors
  };
};
