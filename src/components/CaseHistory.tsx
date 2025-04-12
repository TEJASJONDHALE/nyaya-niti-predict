
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleCases } from '@/utils/mockData';
import { History, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

const CaseHistory: React.FC = () => {
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Acquittal': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Settlement': return <Scale className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Acquittal': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Settlement': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="legal-card">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-legal-primary" />
          <CardTitle className="text-lg text-legal-primary">Recent Case History</CardTitle>
        </div>
        <CardDescription>Sample cases with predictions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {sampleCases.map((caseItem) => (
            <div key={caseItem.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{caseItem.caseNumber}</h4>
                  <p className="text-sm text-gray-500">{caseItem.court}</p>
                </div>
                <Badge className={`flex items-center space-x-1 ${getOutcomeColor(caseItem.outcome)}`}>
                  {getOutcomeIcon(caseItem.outcome)}
                  <span>{caseItem.outcome}</span>
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">{caseItem.description}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-gray-50">
                  {caseItem.caseType}
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-50">
                  {caseItem.witnessCount} witnesses
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-50">
                  {caseItem.duration} days
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseHistory;
