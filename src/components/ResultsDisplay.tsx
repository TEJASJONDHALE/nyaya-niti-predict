
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PredictionResult } from '@/utils/mockData';
import { AlertTriangle, CheckCircle, Scale, PieChart, Info, ArrowRight } from 'lucide-react';
import ExplanationDetail from './ExplanationDetail';

interface ResultsDisplayProps {
  result: PredictionResult | null;
  caseId?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, caseId }) => {
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationFactors, setExplanationFactors] = useState<any[]>([]);

  if (!result) return null;
  
  const confidencePercent = Math.round(result.confidence * 100);
  
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return 'text-red-600';
      case 'Acquittal': return 'text-green-600';
      case 'Settlement': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'Acquittal': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Settlement': return <Scale className="h-6 w-6 text-blue-500" />;
      default: return <Info className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleLoadDetailedExplanation = async () => {
    if (!caseId) {
      // Create mock explanation data if no caseId is provided
      setExplanationFactors([
        {
          factor_name: "Witness Count",
          factor_explanation: "The number of witnesses in this case has a significant impact on the credibility of testimony. More witnesses generally lead to stronger corroboration of facts.",
          factor_weight: 0.75
        },
        {
          factor_name: "Evidence Strength",
          factor_explanation: "The quality and quantity of evidence presented strongly influences the case outcome. Strong evidence includes direct documentation, video recordings, or forensic evidence.",
          factor_weight: 0.85
        },
        {
          factor_name: "Case Type Precedent",
          factor_explanation: "Historical outcomes for similar case types indicate patterns that judges and juries tend to follow. This creates predictable outcomes based on case classification.",
          factor_weight: 0.65
        },
        {
          factor_name: "Jurisdictional Patterns",
          factor_explanation: "Different courts and jurisdictions develop unique approaches to similar cases over time. Local precedent and judicial tendencies influence how evidence is weighed.",
          factor_weight: 0.45
        }
      ]);
      setShowDetailedExplanation(true);
      return;
    }

    try {
      setIsLoadingExplanation(true);
      // In a real implementation, we'd fetch the detailed explanations from Supabase
      // const { data, error } = await supabase
      //   .from('outcome_explanations')
      //   .select('*')
      //   .eq('case_id', caseId);
      
      // if (error) throw error;
      // setExplanationFactors(data || []);
      
      // For now, we'll use mock data
      setTimeout(() => {
        setExplanationFactors([
          {
            factor_name: "Witness Count",
            factor_explanation: "The number of witnesses in this case has a significant impact on the credibility of testimony. More witnesses generally lead to stronger corroboration of facts.",
            factor_weight: 0.75
          },
          {
            factor_name: "Evidence Strength",
            factor_explanation: "The quality and quantity of evidence presented strongly influences the case outcome. Strong evidence includes direct documentation, video recordings, or forensic evidence.",
            factor_weight: 0.85
          },
          {
            factor_name: "Case Type Precedent",
            factor_explanation: "Historical outcomes for similar case types indicate patterns that judges and juries tend to follow. This creates predictable outcomes based on case classification.",
            factor_weight: 0.65
          },
          {
            factor_name: "Jurisdictional Patterns",
            factor_explanation: "Different courts and jurisdictions develop unique approaches to similar cases over time. Local precedent and judicial tendencies influence how evidence is weighed.",
            factor_weight: 0.45
          }
        ]);
        setIsLoadingExplanation(false);
        setShowDetailedExplanation(true);
      }, 1000);
    } catch (error) {
      console.error('Error loading detailed explanation:', error);
      setIsLoadingExplanation(false);
    }
  };
  
  return (
    <>
      <Card className="legal-card">
        <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-legal-primary" />
            <CardTitle className="text-lg text-legal-primary">Prediction Results</CardTitle>
          </div>
          <CardDescription>AI-powered case outcome prediction</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-50 mb-2">
                {getOutcomeIcon(result.outcome)}
              </div>
              <h3 className={`text-2xl font-bold ${getOutcomeColor(result.outcome)}`}>
                {result.outcome}
              </h3>
              <div className="mt-2 text-center">
                <div className="text-sm text-gray-500 mb-1">Confidence</div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={confidencePercent} 
                    className={`h-2 w-36 ${getConfidenceColor(result.confidence)}`} 
                  />
                  <span className="text-sm font-medium">{confidencePercent}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Top Influencing Factors</h4>
              <div className="space-y-3">
                {result.factors.map((factor, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{factor.factor}</span>
                      <span className="text-sm font-medium">{Math.round(factor.importance * 100)}%</span>
                    </div>
                    <Progress 
                      value={factor.importance * 100} 
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Explanation</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                {result.explanation}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg border-t border-gray-100">
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleLoadDetailedExplanation}
            disabled={isLoadingExplanation}
          >
            {isLoadingExplanation ? (
              'Loading detailed explanation...'
            ) : (
              <>
                View Detailed Explanation <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {showDetailedExplanation && (
        <ExplanationDetail factors={explanationFactors} />
      )}
    </>
  );
};

export default ResultsDisplay;
