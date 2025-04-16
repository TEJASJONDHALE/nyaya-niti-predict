
import { useState, useEffect } from 'react';
import { fetchSimilarCasesWithAI } from '@/services/openRouterService';
import { SimilarCase, AIResponse, CasesResponse } from '@/types/similarCasesTypes';
import { useToast } from "@/hooks/use-toast";

export const useSimilarCases = (outcome: string) => {
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'AI' | 'Mock'>('AI');
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
        console.log("Fetched similar cases:", response);
        
        if (Array.isArray(response)) {
          setSimilarCases(response);
          setDataSource('AI');
        } else if (response && typeof response === 'object') {
          if ('cases' in response && Array.isArray((response as CasesResponse).cases)) {
            setSimilarCases((response as CasesResponse).cases);
            setDataSource('AI');
          } else {
            const possibleArrays = Object.values(response).filter(Array.isArray);
            if (possibleArrays.length > 0 && possibleArrays[0].length > 0) {
              setSimilarCases(possibleArrays[0]);
              setDataSource('AI');
            } else {
              console.warn('Could not extract cases array from response, using mock data');
              setDataSource('Mock');
            }
          }
        } else {
          console.warn('Unexpected format for similar cases response', response);
          setDataSource('Mock');
        }

        if (dataSource === 'Mock') {
          toast({
            title: "Using Mock Data",
            description: "Could not retrieve AI-generated similar cases. Using mock data instead.",
            variant: "default"
          });
        }
      } catch (err) {
        console.error('Error fetching similar cases:', err);
        setError('Failed to fetch similar cases');
        setDataSource('Mock');
        toast({
          title: "Error",
          description: "Failed to fetch similar cases. Using mock data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [outcome, toast]);

  return { similarCases, loading, error, dataSource };
};
