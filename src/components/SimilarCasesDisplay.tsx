
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSimilarCases } from '@/hooks/useSimilarCases';
import { SimilarCasesDisplayProps } from '@/types/similarCasesTypes';
import LoadingState from './similar-cases/LoadingState';
import ErrorState from './similar-cases/ErrorState';
import EmptyState from './similar-cases/EmptyState';
import SimilarCaseCard from './similar-cases/SimilarCaseCard';

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome }) => {
  const { similarCases, loading, error, dataSource } = useSimilarCases(outcome);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (similarCases.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-legal-primary" />
            <CardTitle className="text-lg">Similar Criminal Case Precedents</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Hugging Face AI
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered analysis of real cases from eCourts service
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarCases.map((scase) => (
            <SimilarCaseCard key={scase.id} caseData={scase} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarCasesDisplay;
