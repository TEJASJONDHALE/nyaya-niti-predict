
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle2 } from 'lucide-react';

const TrainingSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-legal-primary" />
          <CardTitle className="text-lg">Pre-trained AI Model</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg">Model Ready</h3>
            <p className="text-sm text-gray-600">Our AI model has been trained on 10,000+ cases</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="font-medium mb-1">Data Sources</p>
            <p className="text-sm">eCourts database with 10,000+ criminal cases</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Model Accuracy</p>
            <p className="text-sm">87.4% accuracy on test cases</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Features Used</p>
            <p className="text-sm">Case type, Court, Witnesses, Evidence strength, Case duration</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Target Prediction</p>
            <p className="text-sm">Case outcome (Conviction, Acquittal, Settlement, Dismissal)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingSection;
