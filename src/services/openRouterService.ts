
import { PredictionResult } from '@/utils/mockData';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to get the API key - uses window.env for client-side access
const getApiKey = () => {
  // Try to get from environment or fall back to a prompt if not available
  return process.env.OPENROUTER_API_KEY || localStorage.getItem('OPENROUTER_API_KEY');
};

// Function to fetch similar cases using AI
export const fetchSimilarCasesWithAI = async (outcome: string): Promise<any[]> => {
  try {
    const prompt = `
You are an AI legal research assistant specializing in finding similar criminal case precedents from Indian courts.

Generate 5 highly relevant case precedents for a criminal case with the following outcome: ${outcome}

Provide the response in a strict JSON format with these exact fields:
[{
  "id": "unique-case-identifier",
  "title": "Descriptive case title",
  "court": "Specific court name (e.g., Delhi High Court, Supreme Court)",
  "date": "YYYY-MM-DD format",
  "outcome": "${outcome}",
  "crimeType": "Specific type of crime",
  "relevance": number between 70 and 100,
  "keyFacts": ["concise key fact 1", "concise key fact 2", "concise key fact 3"]
}]

Important guidelines:
- Use real Indian court case references
- Ensure high accuracy and specificity
- Include diverse case scenarios
- Focus on recent cases (last 10-15 years)
`;

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('OpenRouter API key not found');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Legal Case Predictor'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
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

// Function to generate prediction with AI
export const generatePredictionWithAI = async (
  caseType: string,
  witnessCount: number,
  evidenceStrength: string,
  caseFacts: string = ""
): Promise<PredictionResult> => {
  try {
    // For now, we'll return a mocked prediction
    // In a real implementation, this would call OpenRouter API
    return {
      outcome: evidenceStrength === 'Strong' ? 'Conviction' : 'Acquittal',
      confidence: evidenceStrength === 'Strong' ? 0.85 : 0.65,
      explanation: "AI-based analysis of legal precedents and case characteristics to derive insights and predict potential outcomes.",
      factors: [
        { factor: "Evidence Strength", importance: 0.85, reference: `${evidenceStrength} evidence significantly impacts case outcome` },
        { factor: "Witness Count", importance: 0.75, reference: `${witnessCount} witnesses affects credibility of testimony` },
        { factor: "Case Type", importance: 0.65, reference: `${caseType} cases show consistent patterns` }
      ]
    };
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    throw error;
  }
};
