
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, BrainCircuit, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const MLModelTraining = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelTrained, setModelTrained] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv') {
        toast({
          title: 'Invalid File',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        });
        return;
      }
      setCsvFile(file);
      setModelTrained(false);
      toast({
        title: 'File Selected',
        description: `${file.name} selected for training.`,
      });
    }
  };

  const handleTrainModel = async () => {
    if (!csvFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a CSV file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate ML model training process
      toast({
        title: 'Training Started',
        description: 'The ML model training process has started.',
      });

      // Simulate progress updates
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Simulate API delay for model training
      setTimeout(() => {
        clearInterval(interval);
        setTrainingProgress(100);
        
        // Generate random accuracy between 75-95%
        const accuracy = 75 + Math.random() * 20;
        setModelAccuracy(parseFloat(accuracy.toFixed(2)));
        
        setIsTraining(false);
        setModelTrained(true);
        
        toast({
          title: 'Training Completed',
          description: `Model trained successfully with ${accuracy.toFixed(2)}% accuracy.`,
        });
      }, 8000);
      
    } catch (error) {
      console.error('Error during model training:', error);
      toast({
        title: 'Training Failed',
        description: 'An error occurred during the model training process.',
        variant: 'destructive',
      });
      setIsTraining(false);
    }
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
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="train">Train Model</TabsTrigger>
            <TabsTrigger value="results" disabled={!modelTrained}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload CSV file with case data
                </p>
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="csvUpload"
                  className="cursor-pointer px-4 py-2 bg-legal-primary text-white rounded-md hover:bg-legal-primary/90 transition-colors"
                >
                  Select File
                </Label>
              </div>
              {csvFile && (
                <div className="mt-4 text-sm text-gray-600">
                  Selected: {csvFile.name}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => document.querySelector('[data-value="train"]')?.click()}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="train" className="space-y-4">
            {csvFile ? (
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
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No CSV file selected</p>
                <Button variant="outline" onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
                  Go to Upload
                </Button>
              </div>
            )}
            
            {modelTrained && (
              <div className="flex justify-end">
                <Button onClick={() => document.querySelector('[data-value="results"]')?.click()}>
                  View Results <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
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
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => {
                toast({
                  title: "Model Ready",
                  description: "The model is now ready for predictions. You can use it in the Prediction Form."
                });
              }}>
                Use for Predictions
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MLModelTraining;
