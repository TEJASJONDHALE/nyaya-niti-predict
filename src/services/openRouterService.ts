import { PredictionResult } from '@/utils/mockData';

// OpenRouter API configuration
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to generate a prediction using OpenRouter's Claude 3.5 Sonnet
export const generatePredictionWithAI = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  caseFacts: string
): Promise<PredictionResult> => {
  try {
    // Create a prompt for the AI model
    const prompt = `
You are LegalPredictor AI, an expert system for legal case prediction.
Analyze this case and provide a prediction based on the following information:

Case Type: ${caseType}
Number of Witnesses: ${witnessCount}
Evidence Strength: ${evidenceStrength}
Case Facts: ${caseFacts}

Analyze this information and provide a JSON response with the following structure:
{
  "outcome": "Conviction", // can be Conviction, Acquittal, or Settlement
  "confidence": 0.85, // value between 0 and 1
  "explanation": "Detailed explanation of the prediction...",
  "statisticalContext": "Statistical analysis of similar cases...",
  "factors": [
    {
      "factor": "Name of factor influencing the prediction",
      "importance": 0.7, // value between 0 and 1
      "reference": "Reference to similar cases or legal precedents"
    }
    // include at least 3 factors
  ]
}
`;

    // Make API request to OpenRouter
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Legal Case Predictor'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet', // Using Claude 3.5 Sonnet model
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      throw new Error(data.error?.message || 'Failed to get prediction from AI');
    }

    // Parse the response content as JSON
    let aiResponse;
    try {
      const content = data.choices[0].message.content;
      aiResponse = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid response format from AI');
    }

    // Ensure the response has the expected structure
    return {
      outcome: aiResponse.outcome || 'Conviction',
      confidence: aiResponse.confidence || 0.5,
      explanation: aiResponse.explanation || 'Based on the provided case details, our AI model predicts this outcome.',
      statisticalContext: aiResponse.statisticalContext || 'Analysis based on similar legal cases.',
      factors: Array.isArray(aiResponse.factors) ? aiResponse.factors : [
        {
          factor: "Evidence Strength",
          importance: 0.7,
          reference: "Based on analysis of similar cases"
        }
      ]
    };
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    throw error;
  }
};

// Function to fetch similar cases using AI
export const fetchSimilarCasesWithAI = async (outcome: string): Promise<any[]> => {
  try {
    const prompt = `
You are an AI assistant that analyzes legal cases. Please generate 5 relevant similar legal cases from Indian eCourts for a case with outcome: ${outcome}

Return a JSON array of cases with this structure:
[{
  "id": "case-number",
  "title": "case-title",
  "court": "court-name",
  "date": "date",
  "outcome": "${outcome}",
  "crimeType": "crime-type",
  "relevance": number (70-100),
  "keyFacts": ["fact1", "fact2", "fact3"]
}]

Focus on real-world criminal cases from Indian courts, with realistic case numbers, courts, and facts.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Legal Case Predictor'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      throw new Error(data.error?.message || 'Failed to get similar cases from AI');
    }

    let aiResponse;
    try {
      const content = data.choices[0].message.content;
      aiResponse = JSON.parse(content);
      return aiResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error fetching similar cases with AI:', error);
    throw error;
  }
};
