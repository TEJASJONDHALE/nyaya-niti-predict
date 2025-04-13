
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TrainingSectionProps {
  csvFile: File | null;
  isTraining: boolean;
  trainingProgress: number;
  handleTrainModel: () => void;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ 
  csvFile, 
  isTraining, 
  trainingProgress, 
  handleTrainModel 
}) => {
  if (!csvFile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No CSV file selected</p>
        <Button variant="outline" type="button">
          Go to Upload
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">Training Configuration</p>
        <p>File: {csvFile.name}</p>
        <p>Size: {(csvFile.size / 1024).toFixed(2)} KB</p>
        <p>Features: Case type, Court, Witnesses, Evidence strength, Case duration</p>
        <p>Target: Case outcome (Conviction, Acquittal, Settlement, Dismissal)</p>
      </div>
      
      {isTraining && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Training Progress</span>
            <span>{Math.round(trainingProgress)}%</span>
          </div>
          <Progress value={trainingProgress} className="h-2" />
        </div>
      )}
      
      <Button 
        onClick={handleTrainModel} 
        disabled={isTraining || !csvFile}
        className="w-full"
      >
        {isTraining ? 'Training...' : 'Train Model'}
      </Button>
    </>
  );
};

export default TrainingSection;
