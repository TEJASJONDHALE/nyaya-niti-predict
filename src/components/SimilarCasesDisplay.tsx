
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, FileText, Database } from "lucide-react";
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

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome }) => {
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const cases = await fetchSimilarCasesWithAI(outcome);
        console.log("Fetched similar cases:", cases);
        
        // Handle both array format and object with array format
        if (Array.isArray(cases)) {
          setSimilarCases(cases);
        } else if (cases && Array.isArray(cases[0])) {
          setSimilarCases(cases[0]);
        } else {
          setSimilarCases([]);
          console.warn('Unexpected format for similar cases response', cases);
          toast({
            title: "Warning",
            description: "Received unexpected format for similar cases",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching similar cases:', err);
        setError('Failed to fetch similar cases');
        toast({
          title: "Error",
          description: "Failed to fetch similar cases. Using mock data instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (outcome) {
      fetchCases();
    }
  }, [outcome, toast]);
  
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Acquittal': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return 'text-red-600';
      case 'Acquittal': return 'text-green-600';
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
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">{error}</div>
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
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-legal-primary" />
          <CardTitle className="text-lg">Similar Criminal Case Precedents</CardTitle>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered analysis of real cases from eCourts service
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
