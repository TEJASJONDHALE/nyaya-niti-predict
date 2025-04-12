
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PredictionResult } from '@/utils/mockData';
import { AlertTriangle, CheckCircle, Scale, PieChart, Info } from 'lucide-react';

interface ResultsDisplayProps {
  result: PredictionResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
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
  
  return (
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
    </Card>
  );
};

export default ResultsDisplay;
