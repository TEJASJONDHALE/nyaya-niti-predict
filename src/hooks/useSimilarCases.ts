import { useState, useEffect } from 'react';
import { fetchSimilarCasesWithAI } from '@/services/geminiService';
import { SimilarCase, AIResponse, CasesResponse, DataSource } from '@/types/similarCasesTypes';
import { useToast } from "@/hooks/use-toast";

export const useSimilarCases = (outcome: string) => {
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('AI');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCases = async () => {
      if (!outcome) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching similar cases for outcome: ${outcome}`);
        
        const response = await fetchSimilarCasesWithAI(outcome);
        console.log("Perplexity API response for similar cases:", response);
        
        let cases: SimilarCase[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          cases = response;
        } else if (response && typeof response === 'object') {
          if ('cases' in response && Array.isArray((response as CasesResponse).cases)) {
            cases = (response as CasesResponse).cases;
          } else {
            // Try to extract arrays from the response
            const possibleArrays = Object.values(response).filter(val => 
              Array.isArray(val) && val.length > 0 && 
              val[0] && typeof val[0] === 'object' && 'id' in val[0]
            );
            
            if (possibleArrays.length > 0) {
              cases = possibleArrays[0] as SimilarCase[];
            }
          }
        }
        
        // Validate that we have valid case data
        if (cases.length > 0 && isValidCaseData(cases)) {
          setSimilarCases(cases);
          setDataSource('AI');
          console.log("Using AI-generated data from Perplexity:", cases);
        } else {
          throw new Error("Invalid or empty case data received from Perplexity API");
        }
        
      } catch (err) {
        console.error('Error fetching similar cases:', err);
        setError('Failed to fetch similar cases from Gemini AI. Please try again later.');
        
        setSimilarCases([]);
        
        toast({
          title: "Error",
          description: "Failed to fetch similar cases from Gemini AI. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [outcome, toast]);

  // Helper function to validate case data
  const isValidCaseData = (data: any[]): data is SimilarCase[] => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    // Check the first item to see if it has the required fields
    const firstItem = data[0];
    return (
      typeof firstItem === 'object' &&
      'id' in firstItem &&
      'title' in firstItem &&
      'court' in firstItem &&
      'date' in firstItem &&
      'outcome' in firstItem &&
      'keyFacts' in firstItem &&
      Array.isArray(firstItem.keyFacts)
    );
  };

  return { similarCases, loading, error, dataSource };
};
