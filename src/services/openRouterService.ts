
import { PredictionResult } from '@/utils/mockData';

// OpenRouter API configuration
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to generate a prediction using OpenRouter's Llama Mavrik 3.1
export const generatePredictionWithAI = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  caseFacts: string
): Promise<PredictionResult> => {
  try {
    // Create a prompt for the AI model
    const prompt = `
You are LegalPredictor AI, an expert system trained on thousands of legal cases. 
You need to predict the outcome of a legal case based on the following information:

Case Type: ${caseType}
Number of Witnesses: ${witnessCount}
Evidence Strength: ${evidenceStrength}
Case Facts: ${caseFacts}

Analyze this information and provide a JSON response with the following structure:
{
  "outcome": "Conviction", // can be Conviction, Acquittal, or Settlement
  "confidence": 0.85, // value between 0 and 1
  "explanation": "Detailed explanation of the prediction...",
  "statisticalContext": "Statistical analysis comparing this case to historical data...",
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
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'Legal Case Predictor' // Optional - title of your app
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet:beta', // Using Llama Mavrik 3.1 model
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
          reference: "Based on analysis of similar cases with matching evidence profiles."
        }
      ]
    };
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    // Fallback to mock prediction
    return {
      outcome: evidenceStrength === 'Strong' ? 'Conviction' : 'Acquittal',
      confidence: evidenceStrength === 'Strong' ? 0.85 : 0.65,
      explanation: `Prediction based on case facts and available evidence. ${caseType} cases with ${witnessCount} witnesses and ${evidenceStrength.toLowerCase()} evidence typically result in this outcome.`,
      statisticalContext: `Due to an error connecting to our AI service, this is a fallback prediction based on basic case parameters.`,
      factors: [
        {
          factor: "Evidence Strength",
          importance: 0.8,
          reference: `${evidenceStrength} evidence is a primary factor in determining case outcomes.`
        },
        {
          factor: "Witness Count",
          importance: 0.6,
          reference: `${witnessCount} witnesses can significantly impact jury decisions.`
        },
        {
          factor: "Case Type",
          importance: 0.7,
          reference: `${caseType} cases have specific patterns of outcomes based on historical data.`
        }
      ]
    };
  }
};
