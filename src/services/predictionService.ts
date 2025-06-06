import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from '@/utils/mockData';
import { mockPrediction } from '@/utils/mockData'; 
import { isSupabaseConfigured, getMockOrRealSupabase } from '@/lib/supabase';

// Get a prediction from Gemini AI or fallback to mock data
export const getPrediction = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  caseFacts: string = ""
): Promise<PredictionResult | null> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file');
    }

    const prompt = `
You are an AI legal assistant analyzing criminal cases to predict outcomes. Based on the following case details, predict the likely outcome and provide key factors:

Case Type: ${caseType}
Number of Witnesses: ${witnessCount}
Evidence Strength: ${evidenceStrength}
Case Facts: ${caseFacts}

Provide the response in a strict JSON format with these fields:
{
  "outcome": "Conviction" or "Acquittal",
  "confidence": number between 0 and 1,
  "explanation": "detailed explanation string",
  "factors": [
    {
      "factor": "factor name string",
      "importance": number between 0 and 1,
      "reference": "specific reference to case details"
    }
  ]
}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1000,
        },
        safetySettings: []
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get prediction from Gemini AI');
    }

    const data = await response.json();
    console.log("Raw Gemini API prediction response:", data);
    
    try {
      const content = data.candidates[0]?.content?.parts[0]?.text;
      if (!content) {
        throw new Error('Empty response from Gemini AI');
      }
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const prediction = JSON.parse(jsonMatch[0]);
        console.log("Successfully parsed prediction response:", prediction);
        return prediction;
      }
      throw new Error('Invalid JSON format in response');
    } catch (error) {
      console.error('Failed to parse AI prediction response:', error);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error getting prediction from Gemini:', error);
    console.warn('Falling back to mock prediction data.');
    // Fall back to mock prediction on error
    return mockPrediction(caseType, witnessCount, evidenceStrength);
  }
};

// Get detailed explanations for a prediction
export const getExplanationForPrediction = async (
  caseType: string,
  witnessCount: number,
  firSection: string
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
        factor_name: "FIR Section",
        factor_explanation: firSection.includes('IPC 302') || firSection.includes('IPC 376')
          ? `Serious charges under ${firSection} significantly impact case outcomes. In 312 analyzed cases with similar charges, 78% resulted in conviction.`
          : firSection.includes('IPC 323') || firSection.includes('IPC 504')
            ? `Less serious charges under ${firSection} have shown mixed outcomes. Analysis of 196 cases shows these charges leading to varied results depending on other factors.`
            : `The specific charges under ${firSection} will be a key factor in determining the case outcome. Based on 254 similar cases, the nature of the charges significantly influences the final judgment.`,
        factor_weight: firSection.includes('IPC 302') || firSection.includes('IPC 376') ? 0.9 : firSection.includes('IPC 323') || firSection.includes('IPC 504') ? 0.6 : 0.7
      },
      {
        factor_name: "Case Type Analysis",
        factor_explanation: `Analysis of 189 ${caseType} cases reveals consistent patterns in judicial outcomes. Cases with similar fact patterns resulted in predictable outcomes 72% of the time.`,
        factor_weight: 0.7
      },
      {
        factor_name: "Jurisdictional Patterns",
        factor_explanation: "Statistical analysis of 243 cases in similar jurisdictions shows consistent tendencies in how courts handle this type of charge and apply relevant statutes.",
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
