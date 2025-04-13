
import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from '@/utils/mockData';
import { mockPrediction } from '@/utils/mockData'; // Import the mock prediction function
import { isSupabaseConfigured, getMockOrRealSupabase } from '@/lib/supabase';

// Save a case prediction to the database
export const saveCasePrediction = async (
  caseDetails: {
    caseNumber: string;
    caseType: string;
    court: string;
    witnessCount: number;
    evidenceStrength: string;
  }, 
  result: PredictionResult
) => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, prediction not saved to database.');
      return { success: true, caseId: 'mock-id-' + Date.now() };
    }

    const supabase = getMockOrRealSupabase();
    
    // First, insert the case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        case_number: caseDetails.caseNumber,
        case_type: caseDetails.caseType,
        court: caseDetails.court,
        witness_count: caseDetails.witnessCount,
        evidence_strength: caseDetails.evidenceStrength,
        outcome: result.outcome,
        confidence: result.confidence,
        explanation: result.explanation,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select('id')
      .single();

    if (caseError) {
      throw caseError;
    }

    // Then, insert the prediction factors
    const factorsToInsert = result.factors.map(factor => ({
      case_id: caseData.id,
      factor: factor.factor,
      importance: factor.importance
    }));

    const { error: factorsError } = await supabase
      .from('prediction_factors')
      .insert(factorsToInsert);

    if (factorsError) {
      throw factorsError;
    }

    return { success: true, caseId: caseData.id };
  } catch (error) {
    console.error('Error saving prediction:', error);
    return { success: false, error };
  }
};

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
    // This avoids TypeScript errors when accessing properties from the data
    const typedData = data as {
      outcome: string;
      confidence: number;
      explanation: string;
      factors: { factor: string; importance: number }[];
    };

    // Format the result to match our PredictionResult type
    return {
      outcome: typedData.outcome,
      confidence: typedData.confidence,
      explanation: typedData.explanation,
      factors: typedData.factors
    };
  } catch (error) {
    console.error('Error getting prediction:', error);
    // Fall back to mock prediction on error
    return mockPrediction(caseType, witnessCount, evidenceStrength);
  }
};

// Get all cases for the current user
export const getUserCases = async () => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock case data.');
      return []; // Return empty array for development without Supabase
    }

    const supabase = getMockOrRealSupabase();
    
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select(`
        *,
        prediction_factors (*)
      `)
      .order('created_at', { ascending: false });

    if (casesError) {
      throw casesError;
    }

    return cases;
  } catch (error) {
    console.error('Error fetching user cases:', error);
    return [];
  }
};

// Get detailed explanations for a case
export const getExplanationsForCase = async (caseId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock explanation data.');
      // Return mock explanations for development
      return [
        {
          factor_name: "Witness Count",
          factor_explanation: "The number of witnesses significantly impacts the credibility of testimony.",
          factor_weight: 0.7
        },
        {
          factor_name: "Evidence Strength",
          factor_explanation: "Strong evidence provides clear and convincing proof that significantly impacts the case outcome.",
          factor_weight: 0.85
        }
      ];
    }

    const supabase = getMockOrRealSupabase();
    
    const { data, error } = await supabase
      .from('outcome_explanations')
      .select('*')
      .eq('case_id', caseId);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching explanations:', error);
    return [];
  }
};

// Delete a case prediction
export const deleteCasePrediction = async (caseId: string) => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, mock deletion performed.');
      return { success: true };
    }

    const supabase = getMockOrRealSupabase();
    
    // First delete the prediction factors
    const { error: factorsError } = await supabase
      .from('prediction_factors')
      .delete()
      .eq('case_id', caseId);
      
    if (factorsError) {
      throw factorsError;
    }
    
    // Then delete any detailed explanations
    const { error: explanationsError } = await supabase
      .from('outcome_explanations')
      .delete()
      .eq('case_id', caseId);
      
    if (explanationsError) {
      throw explanationsError;
    }
    
    // Then delete the case
    const { error: caseError } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);
    
    if (caseError) {
      throw caseError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting case prediction:', error);
    return { success: false, error };
  }
};
