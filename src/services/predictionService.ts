import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from '@/utils/mockData';
import { mockPrediction } from '@/utils/mockData'; 
import { isSupabaseConfigured, getMockOrRealSupabase } from '@/lib/supabase';
import { generatePredictionWithAI } from './geminiService';

// Get a prediction from Perplexity AI or fallback to mock data
export const getPrediction = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  caseFacts: string = ""
): Promise<PredictionResult | null> => {
  try {
    // Use Perplexity AI for prediction
    const result = await generatePredictionWithAI(
      caseType, 
      witnessCount, 
      evidenceStrength, 
      caseFacts
    );
    
    return result;
  } catch (error) {
    console.error('Error getting prediction from Perplexity:', error);
    console.warn('Falling back to mock prediction data.');
    // Fall back to mock prediction on error
    return mockPrediction(caseType, witnessCount, evidenceStrength);
  }
};

// Get detailed explanations for a prediction
export const getExplanationForPrediction = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string
) => {
  try {
    // In a real app, this would call a backend API to get detailed explanations
    // For now, we'll generate mock explanations
    
    return [
      {
        factor_name: "Witness Count",
        factor_explanation: witnessCount > 5 
          ? `Having ${witnessCount} witnesses significantly strengthens credibility. Analysis of 237 similar cases shows that more than 5 witnesses increases conviction rates by 42%.`
          : `The limited number of witnesses (${witnessCount}) reduces the strength of testimony evidence. Based on 185 analyzed cases, fewer than 3 witnesses correlates with 37% lower conviction rates.`,
        factor_weight: witnessCount > 5 ? 0.8 : 0.4
      },
      {
        factor_name: "Evidence Strength",
        factor_explanation: evidenceStrength === 'Strong'
          ? "Strong evidence provides clear and convincing proof that significantly impacts the case outcome. In 312 analyzed cases with strong evidence, 78% resulted in conviction or favorable judgment."
          : evidenceStrength === 'Moderate'
            ? "Moderate evidence has some persuasive value but contains gaps that limit its impact. Analysis of 196 cases shows moderate evidence leading to mixed outcomes dependent on other factors."
            : "Weak evidence provides minimal support for claims, with significant gaps or credibility issues. Based on 254 cases, weak evidence led to acquittal or dismissal in 68% of instances.",
        factor_weight: evidenceStrength === 'Strong' ? 0.9 : evidenceStrength === 'Moderate' ? 0.6 : 0.3
      },
      {
        factor_name: "Case Type Analysis",
        factor_explanation: `Analysis of 189 ${caseType} cases reveals consistent patterns in judicial outcomes. Cases with similar fact patterns resulted in predictable outcomes 72% of the time.`,
        factor_weight: 0.7
      },
      {
        factor_name: "Jurisdictional Patterns",
        factor_explanation: "Statistical analysis of 243 cases in similar jurisdictions shows consistent tendencies in how courts handle this type of evidence and apply relevant statutes.",
        factor_weight: 0.5
      },
      {
        factor_name: "Legal Framework",
        factor_explanation: "Current interpretation of relevant statutes by higher courts influences the predicted outcome based on precedent analysis of 178 similar cases.",
        factor_weight: 0.65
      }
    ];
  } catch (error) {
    console.error('Error getting explanation:', error);
    return [];
  }
};

// Get similar cases for a prediction
export const getSimilarCases = async (
  outcome: string,
  caseType: string
) => {
  // In a real application, this would query a database of cases
  // For this demo, we'll return mock data
  console.log(`Finding similar cases for ${outcome} in ${caseType}`);
  return [];
};

// Define a proper type for the case details
export type CaseDetails = {
  case_number: string;
  court: string;
  case_type: string;
  witness_count: number;
  evidence_strength: string;
  judge_experience: number;
  case_duration: number;
  outcome: string | null;
};

// Look up case details by case number
export const lookupCaseByNumber = async (caseNumber: string): Promise<CaseDetails | null> => {
  try {
    // In a real application with Supabase configured, query the case_data table
    if (isSupabaseConfigured()) {
      const supabase = getMockOrRealSupabase();
      const { data, error } = await supabase
        .from('case_data')
        .select('*')
        .eq('case_number', caseNumber)
        .single();
      
      if (error) {
        console.error('Error looking up case:', error);
        return getMockCaseDetails(caseNumber);
      }
      
      // Since 'case_type' and 'court' may not exist in the database schema,
      // we need to create them based on the case number
      const crimeType = getCrimeTypeFromCaseNumber(caseNumber);
      const court = getCourtFromCaseNumber(caseNumber);
      
      // Return the data with added case_type and court properties
      return {
        case_number: data.case_number,
        witness_count: data.witness_count,
        evidence_strength: data.evidence_strength,
        judge_experience: data.judge_experience || 0,
        case_duration: data.case_duration || 0,
        outcome: data.outcome || null,
        // Add these properties that might not exist in the database
        case_type: `Criminal - ${crimeType}`,
        court: court
      };
    }
    
    // If Supabase is not configured or there was an error, return mock data
    return getMockCaseDetails(caseNumber);
  } catch (error) {
    console.error('Error looking up case:', error);
    return getMockCaseDetails(caseNumber);
  }
};

// Helper function to determine crime type from case number
const getCrimeTypeFromCaseNumber = (caseString: string): string => {
  const crimeTypes = ['Theft', 'Assault', 'Fraud', 'Homicide', 'Drug Possession'];
  const caseNumSum = caseString.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return crimeTypes[caseNumSum % crimeTypes.length];
};

// Helper function to determine court from case number
const getCourtFromCaseNumber = (caseString: string): string => {
  const courts = ['Supreme Court', 'High Court', 'District Court', 'Sessions Court', 'Metropolitan Court'];
  const caseNumSum = caseString.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return courts[caseNumSum % courts.length];
};

// Helper function to generate mock case details for development/demo
const getMockCaseDetails = (caseNumber: string): CaseDetails => {
  const courts = ['Supreme Court', 'High Court', 'District Court', 'Sessions Court', 'Metropolitan Court'];
  const crimeTypes = ['Theft', 'Assault', 'Fraud', 'Homicide', 'Drug Possession'];
  const evidenceStrengths = ['Strong', 'Moderate', 'Weak'];
  
  // Generate consistent mock data based on the case number
  const caseNumSum = caseNumber.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  return {
    case_number: caseNumber,
    court: courts[caseNumSum % courts.length],
    case_type: `Criminal - ${crimeTypes[caseNumSum % crimeTypes.length]}`,
    witness_count: (caseNumSum % 8) + 1, // 1-8 witnesses
    evidence_strength: evidenceStrengths[caseNumSum % evidenceStrengths.length],
    judge_experience: (caseNumSum % 15) + 5, // 5-20 years experience
    case_duration: (caseNumSum % 24) + 1, // 1-24 months
    outcome: null // We don't know the outcome yet as we're predicting it
  };
};

// Get user's prediction history
export const getUserCases = async () => {
  try {
    // In a production app with Supabase, we would fetch the user's case history
    // For now, return some mock data
    return [
      {
        id: '1',
        created_at: new Date().toISOString(),
        case_number: 'CR-2023-1234',
        case_type: 'Criminal - Theft',
        court: 'District Court',
        outcome: 'Conviction',
        confidence: 0.82,
        witness_count: 4,
        evidence_strength: 'Strong',
        prediction_factors: [
          { factor: 'Evidence Strength', importance: 0.85 },
          { factor: 'Witness Count', importance: 0.72 },
          { factor: 'Case Precedents', importance: 0.65 }
        ]
      },
      {
        id: '2',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        case_number: 'CV-2023-5678',
        case_type: 'Civil - Property Dispute',
        court: 'High Court',
        outcome: 'Settlement',
        confidence: 0.75,
        witness_count: 2,
        evidence_strength: 'Moderate',
        prediction_factors: [
          { factor: 'Evidence Strength', importance: 0.65 },
          { factor: 'Legal Precedent', importance: 0.80 },
          { factor: 'Court Tendencies', importance: 0.70 }
        ]
      }
    ];
  } catch (error) {
    console.error('Error fetching user cases:', error);
    return [];
  }
};

// Delete a case prediction
export const deleteCasePrediction = async (id: string) => {
  try {
    // In a production app with Supabase, we would delete the case
    // For now, just simulate a successful deletion
    console.log(`Deleting case prediction with ID: ${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting prediction:', error);
    return { success: false };
  }
};

// Get detailed explanations for a specific case
export const getExplanationsForCase = async (caseId: string) => {
  try {
    // In a production app, we would fetch real data for the specific case
    console.log(`Fetching explanations for case: ${caseId}`);
    return [
      {
        factor_name: "Evidence Strength",
        factor_explanation: "The quality of evidence presented was a significant factor. Analysis of 312 similar cases shows that strong evidence increased conviction rates by 78%.",
        factor_weight: 0.85
      },
      {
        factor_name: "Witness Credibility",
        factor_explanation: "The credibility of witness testimony had substantial impact. In 237 analyzed cases, credible witness testimony increased successful outcomes by 62%.",
        factor_weight: 0.75
      },
      {
        factor_name: "Legal Precedents",
        factor_explanation: "Previous similar cases established strong precedents that influenced this outcome. Analysis of 189 precedent cases showed consistent rulings in 72% of instances.",
        factor_weight: 0.65
      },
      {
        factor_name: "Court Jurisdiction Patterns",
        factor_explanation: "Statistical analysis of 243 cases in this jurisdiction reveals consistent tendencies in how this court handles similar cases.",
        factor_weight: 0.55
      }
    ];
  } catch (error) {
    console.error('Error fetching explanations:', error);
    return [];
  }
};
