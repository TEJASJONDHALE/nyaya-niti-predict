
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, AlertCircle, Lightbulb, Scale, FileText } from "lucide-react";

type ExplanationFactor = {
  factor_name: string;
  factor_explanation: string;
  factor_weight: number;
};

interface ExplanationDetailProps {
  factors: ExplanationFactor[];
}

const ExplanationDetail: React.FC<ExplanationDetailProps> = ({ factors }) => {
  if (!factors || factors.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">No detailed explanations available for this prediction.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort factors by weight (most important first)
  const sortedFactors = [...factors].sort((a, b) => b.factor_weight - a.factor_weight);

  const getFactorIcon = (factorName: string) => {
    if (factorName.includes("Witness")) return <FileText className="h-4 w-4 mr-2 text-blue-500" />;
    if (factorName.includes("Evidence")) return <AlertCircle className="h-4 w-4 mr-2 text-red-500" />;
    if (factorName.includes("Precedent") || factorName.includes("Historical")) return <Scale className="h-4 w-4 mr-2 text-purple-500" />;
    return <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />;
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-legal-primary" />
          <CardTitle className="text-lg">AI-Generated Case Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedFactors.map((factor, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getFactorIcon(factor.factor_name)}
                  <h3 className="font-medium">{factor.factor_name}</h3>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {Math.round(factor.factor_weight * 100)}% impact
                </span>
              </div>
              
              <Progress
                value={factor.factor_weight * 100}
                className="h-1.5 mb-3"
              />
              
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {factor.factor_explanation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationDetail;
