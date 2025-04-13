
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface ResultsSectionProps {
  modelAccuracy: number;
  onUseForPredictions: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  modelAccuracy, 
  onUseForPredictions 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Training Results</h3>
      <div className="space-y-4">
        <div>
          <Label className="mb-1 block">Model Accuracy</Label>
          <div className="flex items-center">
            <Progress value={modelAccuracy} className="h-3 flex-grow" />
            <span className="ml-2 font-medium">{modelAccuracy}%</span>
          </div>
        </div>
        
        <div>
          <Label className="mb-1 block">Feature Importance</Label>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Evidence Strength</span>
              <Progress value={85} className="h-2 w-1/2" />
              <span className="text-sm font-medium">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Witness Count</span>
              <Progress value={72} className="h-2 w-1/2" />
              <span className="text-sm font-medium">72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Case Duration</span>
              <Progress value={65} className="h-2 w-1/2" />
              <span className="text-sm font-medium">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Court</span>
              <Progress value={58} className="h-2 w-1/2" />
              <span className="text-sm font-medium">58%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white rounded border border-gray-200">
        <h4 className="font-medium mb-2">Model Information</h4>
        <p className="text-sm text-gray-600">
          The trained model can now be used for case outcome predictions. It analyzes patterns from the historical case data to predict outcomes and provide explanations based on similar precedents.
        </p>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={onUseForPredictions}>
          Use for Predictions
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
