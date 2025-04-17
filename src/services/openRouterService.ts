import { PredictionResult } from '@/utils/mockData';

// Function to get the Hugging Face API key
const getHuggingFaceApiKey = () => {
  // Using the provided API key
  return "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";
};

// Mock similar cases for fallback
const mockSimilarCases = (outcome: string) => {
  const convictionCases = [
    {
      id: "SC-2017-1234",
      title: "State vs. Rajesh Kumar",
      court: "Supreme Court of India",
      date: "2019-05-12",
      outcome: "Conviction",
      crimeType: "Robbery",
      relevance: 92,
      keyFacts: ["Multiple eyewitnesses", "Stolen property recovered", "CCTV evidence available"]
    },
    {
      id: "HC-DEL-2018-5678",
      title: "NCT of Delhi vs. Ramesh Singh & Others",
      court: "Delhi High Court",
      date: "2020-07-23",
      outcome: "Conviction",
      crimeType: "Armed Robbery",
      relevance: 88,
      keyFacts: ["Weapons used in crime", "Three witnesses identified accused", "Mobile phone location evidence"]
    },
    {
      id: "HC-MUM-2019-9012",
      title: "Maharashtra State vs. Abdul Khan",
      court: "Mumbai High Court",
      date: "2021-03-15",
      outcome: "Conviction",
      crimeType: "Theft",
      relevance: 83,
      keyFacts: ["Fingerprint evidence", "Stolen items recovered", "Previous criminal record"]
    },
    {
      id: "DC-BLR-2020-3456",
      title: "State vs. Venkatesh",
      court: "Bengaluru District Court",
      date: "2022-01-07",
      outcome: "Conviction",
      crimeType: "Burglary",
      relevance: 76,
      keyFacts: ["Break-in evidence", "Witness testimony", "Forensic evidence linking to scene"]
    },
    {
      id: "SC-2016-7890",
      title: "Narendra Singh vs. State of Punjab",
      court: "Supreme Court of India",
      date: "2018-11-30",
      outcome: "Conviction",
      crimeType: "Aggravated Theft",
      relevance: 72,
      keyFacts: ["Violent confrontation", "Multiple victims", "DNA evidence presented"]
    }
  ];

  const acquittalCases = [
    {
      id: "HC-KOL-2018-2345",
      title: "West Bengal State vs. Ranjan Das",
      court: "Kolkata High Court",
      date: "2020-02-18",
      outcome: "Acquittal",
      crimeType: "Theft",
      relevance: 94,
      keyFacts: ["Inconclusive evidence", "Alibi confirmed", "Mistaken identity"]
    },
    {
      id: "SC-2017-6789",
      title: "State of Maharashtra vs. Imran Sheikh",
      court: "Supreme Court of India",
      date: "2019-09-05",
      outcome: "Acquittal",
      crimeType: "Robbery",
      relevance: 89,
      keyFacts: ["Witness contradictions", "Insufficient evidence", "Procedural violations"]
    },
    {
      id: "HC-CHN-2019-1234",
      title: "Tamil Nadu vs. Murugan",
      court: "Chennai High Court",
      date: "2021-05-30",
      outcome: "Acquittal",
      crimeType: "Burglary",
      relevance: 85,
      keyFacts: ["Lack of forensic evidence", "Unreliable witness testimony", "Police procedural errors"]
    },
    {
      id: "DC-DEL-2020-5678",
      title: "State vs. Ajay Kumar",
      court: "Delhi District Court",
      date: "2022-03-12",
      outcome: "Acquittal",
      crimeType: "Theft",
      relevance: 79,
      keyFacts: ["CCTV footage inconclusive", "Multiple suspects", "Reasonable doubt established"]
    },
    {
      id: "HC-GUJ-2018-9012",
      title: "Gujarat State vs. Patel & Others",
      court: "Gujarat High Court",
      date: "2020-11-09",
      outcome: "Acquittal",
      crimeType: "Armed Robbery",
      relevance: 74,
      keyFacts: ["Alibi verified", "Evidence mishandling", "Eyewitness reliability questioned"]
    }
  ];

  return outcome.toLowerCase().includes('acquit') ? acquittalCases : convictionCases;
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
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      throw new Error(error.error || 'Failed to get similar cases from Hugging Face API');
    }

    const data = await response.json();
    
    try {
      let content = data[0]?.generated_text;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(content);
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
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      throw new Error(error.error || 'Failed to get prediction from Hugging Face API');
    }

    const data = await response.json();
    
    try {
      let content = data[0]?.generated_text;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const prediction = JSON.parse(content);
      return prediction;
    } catch (error) {
      console.error('Failed to parse AI response:', error, 'Raw response:', data);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    throw error;
  }
};
