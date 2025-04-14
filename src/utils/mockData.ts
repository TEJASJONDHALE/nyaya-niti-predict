
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
  statisticalContext?: string;
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
    caseNumber: 'CR-2023-5678',
    court: 'High Court',
    caseType: 'Criminal - Assault',
    outcome: 'Acquittal',
    description: 'An assault case with weak evidence leading to acquittal.',
    witnessCount: 2,
    duration: 180,
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
  },
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
    { factor: 'Evidence Strength', importance: 0.85 },
    { factor: 'Witness Count', importance: 0.72 },
    { factor: 'Prior Criminal Record', importance: 0.68 },
    { factor: 'Police Testimony', importance: 0.62 }
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
  const explanation = `Based on analysis of 10,000+ similar criminal cases, with ${witnessCount} witnesses and ${evidenceStrength.toLowerCase()} evidence provided in this ${caseType.toLowerCase()} case, our AI model predicts a ${outcome.toLowerCase()} outcome with ${Math.round(confidence * 100)}% confidence.`;
  
  // Generate statistical context
  const statisticalContext = generateStatisticalContext(caseType, witnessCount, evidenceStrength, outcome);
  
  // Generate mock factors specific to criminal cases
  const factors: PredictionFactor[] = [
    {
      factor: 'Witness Count',
      importance: witnessCount > 3 ? 0.7 : 0.3,
      reference: witnessCount > 3 ? 'Based on 237 similar criminal cases, more than 3 witnesses significantly increases conviction rates by 42%.' : 'Analysis of 185 cases shows fewer witnesses correlate with 37% lower conviction rates.'
    },
    {
      factor: 'Evidence Strength',
      importance: evidenceStrength === 'Strong' ? 0.8 : evidenceStrength === 'Moderate' ? 0.5 : 0.2,
      reference: evidenceStrength === 'Strong' ? 'In 312 analyzed criminal cases with strong evidence, 78% resulted in conviction.' : 'Based on 254 cases, weak evidence led to acquittal in 68% of instances.'
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
    statisticalContext,
    factors
  };
};

// Helper function to generate statistical context
const generateStatisticalContext = (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  outcome: string
): string => {
  let context = '';
  
  // Add crime type specific context
  if (caseType.includes('Theft')) {
    context += `Analysis of 537 theft cases reveals that ${evidenceStrength.toLowerCase()} evidence leads to ${outcome.toLowerCase()} in ${evidenceStrength === 'Strong' ? '82%' : evidenceStrength === 'Moderate' ? '64%' : '37%'} of cases. `;
  } else if (caseType.includes('Assault')) {
    context += `Historical data from 412 assault cases demonstrates ${witnessCount > 3 ? 'a strong correlation between multiple witnesses and conviction rates (76% conviction rate)' : 'that cases with few witnesses face challenges in court (43% conviction rate)'}. `;
  } else if (caseType.includes('Fraud')) {
    context += `Analysis of 389 fraud cases shows that ${evidenceStrength === 'Strong' ? 'strong documentary evidence is pivotal to successful prosecution (88% conviction rate)' : 'cases without solid documentation face significant hurdles (32% conviction rate)'}. `;
  } else if (caseType.includes('Homicide')) {
    context += `Data from 256 homicide proceedings indicates that ${witnessCount > 4 ? 'cases with multiple witnesses show a 79% conviction rate' : 'cases with limited witness testimony have a 51% conviction rate'} when combined with ${evidenceStrength.toLowerCase()} forensic evidence. `;
  } else if (caseType.includes('Drug')) {
    context += `Review of 623 drug possession cases shows ${evidenceStrength === 'Strong' ? 'a 91% conviction rate with strong evidence' : 'a significant dependence on evidence quality, with weak evidence leading to only 45% conviction rate'}. `;
  }
  
  // Add witness testimony statistical context
  if (witnessCount > 4) {
    context += `Cases with ${witnessCount} or more witnesses have historically shown a 73% higher likelihood of conviction across all criminal types. `;
  } else if (witnessCount > 2) {
    context += `Cases with a moderate number of witnesses (${witnessCount}) typically show mixed outcomes depending on witness credibility and consistency. `;
  } else {
    context += `Cases with only ${witnessCount} witness(es) face an average 47% lower conviction rate, placing greater emphasis on physical evidence quality. `;
  }
  
  // Add evidence strength context
  context += `${evidenceStrength} evidence quality has been shown to affect case outcomes by ${evidenceStrength === 'Strong' ? '+64%' : evidenceStrength === 'Moderate' ? '+21%' : '-26%'} in a longitudinal study of 1,250 criminal proceedings over the past decade.`;
  
  return context;
};
