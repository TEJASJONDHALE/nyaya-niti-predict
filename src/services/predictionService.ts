
import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from '@/utils/mockData';
import { mockPrediction } from '@/utils/mockData'; // Import the mock prediction function
import { isSupabaseConfigured, getMockOrRealSupabase } from '@/lib/supabase';

// Get a prediction from the backend
export const getPrediction = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string
): Promise<PredictionResult | null> => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock prediction data.');
      // Return mock prediction when Supabase is not available
      return mockPrediction(caseType, witnessCount, evidenceStrength);
    }

    const supabase = getMockOrRealSupabase();
    
    // In a production app with Supabase configured, call the RPC function
    const { data, error } = await supabase.rpc('predict_outcome', {
      case_type: caseType,
      witness_count: witnessCount,
      evidence_strength: evidenceStrength
    });

    if (error) {
      throw error;
    }

    // Type the response data more explicitly to handle JSON properties
    const typedData = data as {
      outcome: string;
      confidence: number;
      explanation: string;
      factors: { factor: string; importance: number; reference?: string }[];
    };

    // Format the result to match our PredictionResult type
    return {
      outcome: typedData.outcome,
      confidence: typedData.confidence,
      explanation: typedData.explanation,
      factors: typedData.factors.map(factor => ({
        factor: factor.factor,
        importance: factor.importance,
        reference: factor.reference || `Based on analysis of similar cases with matching ${factor.factor.toLowerCase()} characteristics.`
      }))
    };
  } catch (error) {
    console.error('Error getting prediction:', error);
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
