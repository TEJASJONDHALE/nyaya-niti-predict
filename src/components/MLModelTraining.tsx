
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUploadSection from './training/FileUploadSection';
import TrainingSection from './training/TrainingSection';
import ResultsSection from './training/ResultsSection';
import { useModelTraining } from '@/hooks/useModelTraining';

const MLModelTraining = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const {
    csvFile,
    setCsvFile,
    isTraining,
    trainingProgress,
    modelTrained,
    modelAccuracy,
    handleTrainModel,
    handleUseForPredictions
  } = useModelTraining();
  
  const navigateToTab = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-legal-primary" />
          <CardTitle className="text-lg">ML Model Training</CardTitle>
        </div>
        <CardDescription>Train the case prediction model using CSV data</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="train">Train Model</TabsTrigger>
            <TabsTrigger value="results" disabled={!modelTrained}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <FileUploadSection csvFile={csvFile} setCsvFile={setCsvFile} />
            
            <div className="flex justify-end">
              <Button onClick={() => navigateToTab('train')}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="train" className="space-y-4">
            <TrainingSection 
              csvFile={csvFile}
              isTraining={isTraining}
              trainingProgress={trainingProgress}
              handleTrainModel={handleTrainModel}
            />
            
            {modelTrained && (
              <div className="flex justify-end">
                <Button onClick={() => navigateToTab('results')}>
                  View Results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <ResultsSection 
              modelAccuracy={modelAccuracy} 
              onUseForPredictions={handleUseForPredictions}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MLModelTraining;
