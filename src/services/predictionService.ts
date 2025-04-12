
import { supabase } from '@/lib/supabase';
import { PredictionResult } from '@/utils/mockData';

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

export const getPrediction = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string
): Promise<PredictionResult | null> => {
  try {
    // In a production app, you'd call a real ML model here
    // For now, we'll use the mock prediction function to simulate the AI
    const { data, error } = await supabase.rpc('predict_outcome', {
      case_type: caseType,
      witness_count: witnessCount,
      evidence_strength: evidenceStrength
    });

    if (error) {
      throw error;
    }

    // Format the result to match our PredictionResult type
    return {
      outcome: data.outcome,
      confidence: data.confidence,
      explanation: data.explanation,
      factors: data.factors as { factor: string; importance: number }[]
    };
  } catch (error) {
    console.error('Error getting prediction:', error);
    return null;
  }
};

export const getUserCases = async () => {
  try {
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
    return null;
  }
};
