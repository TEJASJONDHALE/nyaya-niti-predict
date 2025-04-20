
// Function to get similar cases using Perplexity AI
export const fetchSimilarCasesWithAI = async (outcome: string): Promise<any[]> => {
  try {
    const apiKey = localStorage.getItem('perplexityApiKey');
    if (!apiKey) {
      throw new Error('Please enter your Perplexity API key in the settings');
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
`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      throw new Error(errorData.error || 'Failed to get similar cases from Perplexity AI');
    }

    const data = await response.json();
    console.log("Raw Perplexity API response:", data);
    
    try {
      let content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from Perplexity AI');
      }
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(content);
      console.log("Successfully parsed response:", parsedResponse);
      return parsedResponse;
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
): Promise<any> => {
  try {
    const apiKey = localStorage.getItem('perplexityApiKey');
    if (!apiKey) {
      throw new Error('Please enter your Perplexity API key in the settings');
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

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      throw new Error(errorData.error || 'Failed to get prediction from Perplexity AI');
    }

    const data = await response.json();
    console.log("Raw Perplexity API prediction response:", data);
    
    try {
      let content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from Perplexity AI');
      }
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      const prediction = JSON.parse(content);
      console.log("Successfully parsed prediction response:", prediction);
      return prediction;
    } catch (error) {
      console.error('Failed to parse AI prediction response:', error);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating prediction with AI:', error);
    throw error;
  }
};
