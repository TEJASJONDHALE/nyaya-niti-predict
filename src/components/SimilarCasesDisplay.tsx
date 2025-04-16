import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, FileText, Database, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchSimilarCasesWithAI } from '@/services/openRouterService';
import { useToast } from "@/hooks/use-toast";

interface SimilarCasesDisplayProps {
  outcome: string;
}

interface SimilarCase {
  id: string;
  title: string;
  court: string;
  date: string;
  outcome: string;
  crimeType: string;
  relevance: number;
  keyFacts: string[];
}

interface CasesResponse {
  cases: SimilarCase[];
  [key: string]: any;
}

type AIResponse = SimilarCase[] | CasesResponse | Record<string, unknown>;

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome }) => {
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
          if (response && 'cases' in response && Array.isArray(response.cases)) {
            setSimilarCases(response.cases);
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
  
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'conviction': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'acquittal': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'conviction': return 'text-red-600';
      case 'acquittal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  const getBadgeColor = (relevance: number) => {
    if (relevance >= 90) return 'bg-green-100 text-green-800';
    if (relevance >= 80) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-primary"></div>
            <p className="text-sm text-gray-500">Searching for similar cases...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarCases.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-gray-500 text-center">No similar cases found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-legal-primary" />
            <CardTitle className="text-lg">Similar Criminal Case Precedents</CardTitle>
          </div>
          {dataSource === 'Mock' && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              Mock Data
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {dataSource === 'AI' 
            ? 'AI-powered analysis of real cases from eCourts service'
            : 'Sample case data for demonstration purposes'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarCases.map((scase) => (
            <div key={scase.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{scase.title}</h3>
                  <p className="text-sm text-gray-600">{scase.id} • {scase.court}</p>
                  <p className="text-xs text-gray-500 mt-1">Crime: {scase.crimeType}</p>
                </div>
                <Badge className={getBadgeColor(scase.relevance)}>
                  {scase.relevance}% Match
                </Badge>
              </div>
              
              <div className="flex items-center mb-3">
                <span className="text-sm text-gray-500 mr-3">Date: {scase.date}</span>
                <div className="flex items-center">
                  {getOutcomeIcon(scase.outcome)}
                  <span className={`text-sm ml-1 font-medium ${getOutcomeColor(scase.outcome)}`}>
                    {scase.outcome}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Key Facts:</p>
                <div className="flex flex-wrap gap-1">
                  {scase.keyFacts.map((fact, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {fact}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarCasesDisplay;
