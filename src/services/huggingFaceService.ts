
import { PredictionResult } from '@/utils/mockData';

// Function to get the Hugging Face API key
const getHuggingFaceApiKey = () => {
  // Using the correct API key format
  return "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";
};

// Function to fetch similar cases using Hugging Face API
export const fetchSimilarCasesWithAI = async (outcome: string): Promise<any[]> => {
  try {
    const apiKey = getHuggingFaceApiKey();
    if (!apiKey) {
      console.error('Hugging Face API key not found');
      throw new Error('API key not configured');
    }

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

    console.log(`Sending request to Hugging Face API with key: ${apiKey.substring(0, 5)}...`);
    const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf';
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: 0.3,
          max_new_tokens: 1500,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Hugging Face API error:', errorResponse);
      throw new Error(errorResponse.error || 'Failed to get similar cases from Hugging Face API');
    }

    const data = await response.json();
    console.log("Raw Hugging Face API response:", data);
    
    try {
      let content = data[0]?.generated_text;
      if (!content) {
        throw new Error('Empty response from Hugging Face API');
      }
      
      console.log("Generated text content:", content);
      
      // Find JSON content within the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        content = jsonMatch[0];
        console.log("Extracted JSON content:", content);
      } else {
        console.warn("Could not extract JSON from response, using full text");
      }
      
      const parsedResponse = JSON.parse(content);
      console.log("Successfully parsed response:", parsedResponse);
      return parsedResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', error, 'Raw response:', data);
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
    const apiKey = getHuggingFaceApiKey();
    if (!apiKey) {
      throw new Error('Hugging Face API key not found');
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
}

Ensure high accuracy and detailed analysis based on legal precedents.`;

    console.log(`Sending prediction request to Hugging Face API with key: ${apiKey.substring(0, 5)}...`);
    const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf';
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: 0.3,
          max_new_tokens: 1500,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Hugging Face API error:', errorResponse);
      throw new Error(errorResponse.error || 'Failed to get prediction from Hugging Face API');
    }

    const data = await response.json();
    console.log("Raw Hugging Face API prediction response:", data);
    
    try {
      let content = data[0]?.generated_text;
      if (!content) {
        throw new Error('Empty response from Hugging Face API');
      }
      
      console.log("Generated prediction text content:", content);
      
      // Find JSON content within the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
        console.log("Extracted prediction JSON content:", content);
      } else {
        console.warn("Could not extract JSON from prediction response, using full text");
      }
      
      const prediction = JSON.parse(content);
      console.log("Successfully parsed prediction response:", prediction);
      return prediction;
    } catch (error) {
      console.error('Failed to parse AI prediction response:', error, 'Raw response:', data);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    throw error;
  }
};
