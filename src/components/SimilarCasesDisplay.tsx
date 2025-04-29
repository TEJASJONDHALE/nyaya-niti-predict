import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { similarCases } from '@/utils/mockData';
import SimilarCaseCard from './similar-cases/SimilarCaseCard';

interface SimilarCasesDisplayProps {
  outcome: string;
}

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome }) => {
  // Filter similar cases based on outcome
  const filteredCases = similarCases.filter(caseItem => caseItem.outcome === outcome);
  
  return (
    <Card className="legal-card mt-6">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg text-legal-primary">Similar Criminal Case Precedents</CardTitle>
        </div>
        <CardDescription>Historical cases with similar characteristics and outcomes</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {filteredCases.map((caseItem) => (
            <SimilarCaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarCasesDisplay;
