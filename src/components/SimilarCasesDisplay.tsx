import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { similarCases } from '@/utils/mockData';
import SimilarCaseCard from './similar-cases/SimilarCaseCard';

interface SimilarCasesDisplayProps {
  outcome: string;
  crimeType: string;
}

const theftCases = [
  {
    "id": "TC-1",
    "title": "State vs. Mohd. Afzal",
    "court": "Delhi District Court",
    "date": "2021-12-24",
    "outcome": "Acquittal",
    "crimeType": "Theft",
    "relevance": 80,
    "keyFacts": ["Theft of vehicle (TSR)", "Recovered from accused", "Insufficient evidence for conviction"],
    "firNumber": "eFIR-32600/2017",
    "firSection": "IPC 379/411",
    "firDate": "2017-10-14"
  },
  {
    "id": "TC-2",
    "title": "State vs. Shoaib Khan",
    "court": "Delhi District Court",
    "date": "2022-12-28",
    "outcome": "Arrested",
    "crimeType": "Theft",
    "relevance": 85,
    "keyFacts": ["Theft of jewellery and watches worth ₹2 crore", "Former employee of victim", "Items recovered within 24 hours"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 380",
    "firDate": "2022-12-26"
  },
  {
    "id": "TC-3",
    "title": "State vs. Nand Kishore Singh",
    "court": "Patna District Court",
    "date": "2024-01-03",
    "outcome": "Arrested",
    "crimeType": "Theft",
    "relevance": 90,
    "keyFacts": ["Theft of ₹36 lakh from financial firm", "Accused was risk manager", "Used duplicate key to access safe"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 381",
    "firDate": "2023-12-26"
  },
  {
    "id": "TC-4",
    "title": "State vs. Prakash alias Bhaya & Chail Singh",
    "court": "Barmer District Court",
    "date": "2022-06-21",
    "outcome": "Arrested",
    "crimeType": "Theft",
    "relevance": 75,
    "keyFacts": ["Theft of ₹20 lakh from temple donation box", "Case solved after 5 years", "Accused involved in multiple temple thefts"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 380",
    "firDate": "2017-02-15"
  },
  {
    "id": "TC-5",
    "title": "State vs. Kapil",
    "court": "Hapur District Court",
    "date": "2024-12-10",
    "outcome": "Conviction",
    "crimeType": "Theft",
    "relevance": 70,
    "keyFacts": ["Theft case from 2023", "Convicted with 1-year imprisonment", "Fine of ₹3,000 imposed"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 379",
    "firDate": "2023-Unknown"
  },
  {
    "id": "TC-6",
    "title": "State vs. Vinod alias Bhola",
    "court": "Hapur District Court",
    "date": "2024-12-10",
    "outcome": "Conviction",
    "crimeType": "Theft",
    "relevance": 70,
    "keyFacts": ["Theft case from Bahadurgarh", "Convicted with 3-year imprisonment", "Fine of ₹6,500 imposed"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 379",
    "firDate": "2023-Unknown"
  },
  {
    "id": "TC-7",
    "title": "State vs. Rajjaua",
    "court": "Meerut District Court",
    "date": "1958-12-12",
    "outcome": "Conviction",
    "crimeType": "Theft",
    "relevance": 65,
    "keyFacts": ["Theft of ornaments", "Recovered from accused's possession", "Convicted under IPC 411"],
    "firNumber": "FIR-Unknown",
    "firSection": "IPC 411",
    "firDate": "1956-07-19"
  }
];

const SimilarCasesDisplay: React.FC<SimilarCasesDisplayProps> = ({ outcome, crimeType }) => {
  const [displayedCases, setDisplayedCases] = useState<any[]>([]);

  useEffect(() => {
    // Combine both fraud and theft cases
    const allCases = [...similarCases, ...theftCases];
    
    // Filter cases based on crime type
    const filteredCases = allCases.filter(caseItem => 
      caseItem.crimeType.toLowerCase().includes(crimeType.toLowerCase())
    );
    
    // Shuffle the filtered cases
    const shuffledCases = [...filteredCases].sort(() => Math.random() - 0.5);
    
    // Take only the first 5 cases
    setDisplayedCases(shuffledCases.slice(0, 5));
  }, [outcome, crimeType]);

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
          {displayedCases.map((caseItem) => (
            <SimilarCaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarCasesDisplay;
