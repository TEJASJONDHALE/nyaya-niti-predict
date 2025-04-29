import React from 'react';
import { AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimilarCase } from '@/types/similarCasesTypes';

interface SimilarCaseCardProps {
  caseData: SimilarCase;
}

const SimilarCaseCard: React.FC<SimilarCaseCardProps> = ({ caseData }) => {
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

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{caseData.title}</h3>
          <p className="text-sm text-gray-600">{caseData.id} • {caseData.court}</p>
          <p className="text-xs text-gray-500 mt-1">Crime: {caseData.crimeType}</p>
        </div>
        <Badge className={getBadgeColor(caseData.relevance)}>
          {caseData.relevance}% Match
        </Badge>
      </div>
      
      <div className="flex items-center mb-3">
        <span className="text-sm text-gray-500 mr-3">Date: {caseData.date}</span>
        <div className="flex items-center">
          {getOutcomeIcon(caseData.outcome)}
          <span className={`text-sm ml-1 font-medium ${getOutcomeColor(caseData.outcome)}`}>
            {caseData.outcome}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-1">FIR Details:</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
            FIR No: {caseData.firNumber}
          </span>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
            Section: {caseData.firSection}
          </span>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
            FIR Date: {caseData.firDate}
          </span>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-1">Key Facts:</p>
        <div className="flex flex-wrap gap-1">
          {caseData.keyFacts.map((fact, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {fact}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarCaseCard;
