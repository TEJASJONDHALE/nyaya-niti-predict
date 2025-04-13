
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Scale, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SimilarCasesDisplayProps {
  outcome: string;
}

interface SimilarCase {
  id: string;
  title: string;
  court: string;
  date: string;
  outcome: string;
  relevance: number;
  keyFacts: string[];
}

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome }) => {
  // Generate mock similar cases based on the predicted outcome
  const generateSimilarCases = (outcome: string): SimilarCase[] => {
    const courts = ["Delhi High Court", "Mumbai High Court", "Chennai High Court", "Supreme Court"];
    const years = [2018, 2019, 2020, 2021, 2022, 2023];
    
    const keyFactsByOutcome: Record<string, string[]> = {
      'Conviction': [
        "Strong forensic evidence",
        "Multiple consistent witness testimonies",
        "Prior criminal record",
        "Confession during investigation",
        "CCTV footage evidence"
      ],
      'Acquittal': [
        "Insufficient evidence",
        "Contradictory witness testimonies",
        "Procedural irregularities",
        "Constitutional rights violation",
        "Alibi confirmed"
      ],
      'Settlement': [
        "Mutual agreement between parties",
        "Compensation provided",
        "Partial admission of liability",
        "Mediator involvement",
        "Family relationship considerations"
      ],
      'Dismissed': [
        "Lack of jurisdiction",
        "Statute of limitations expired",
        "Insufficient prima facie case",
        "Procedural non-compliance",
        "Key witness unavailable"
      ]
    };
    
    const defaultFacts = ["Case complexity", "Duration of proceedings", "Legal precedents applied"];
    
    const specificFacts = keyFactsByOutcome[outcome] || defaultFacts;
    
    return Array(5).fill(null).map((_, i) => {
      const caseNum = Math.floor(10000 + Math.random() * 90000);
      const year = years[Math.floor(Math.random() * years.length)];
      const court = courts[Math.floor(Math.random() * courts.length)];
      const factCount = Math.floor(Math.random() * 3) + 1;
      const selectedFacts = [...specificFacts].sort(() => 0.5 - Math.random()).slice(0, factCount);
      
      return {
        id: `CASE-${year}-${caseNum}`,
        title: `State vs. ${['Smith', 'Kumar', 'Singh', 'Patel', 'Khan'][Math.floor(Math.random() * 5)]}`,
        court,
        date: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${year}`,
        outcome,
        relevance: Math.floor(70 + Math.random() * 30),
        keyFacts: selectedFacts
      };
    }).sort((a, b) => b.relevance - a.relevance);
  };
  
  const similarCases = generateSimilarCases(outcome);
  
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Acquittal': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Settlement': return <Scale className="h-5 w-5 text-blue-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return 'text-red-600';
      case 'Acquittal': return 'text-green-600';
      case 'Settlement': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  const getBadgeColor = (relevance: number) => {
    if (relevance >= 90) return 'bg-green-100 text-green-800';
    if (relevance >= 80) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-legal-primary" />
          <CardTitle className="text-lg">Similar Case Precedents</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarCases.map((scase) => (
            <div key={scase.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{scase.title}</h3>
                  <p className="text-sm text-gray-600">{scase.id} • {scase.court}</p>
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
