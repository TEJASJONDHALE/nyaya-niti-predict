import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import Header from '@/components/Header';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import PredictionHistory from '@/components/PredictionHistory';
import { PredictionResult, similarCases } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, History, Download, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState('predict');
  const [resetForm, setResetForm] = useState(false);
  const [crimeType, setCrimeType] = useState<string>('');
  const { user } = useAuth();

  const handlePredict = (result: PredictionResult, type: string) => {
    setPredictionResult(result);
    setCrimeType(type);
    setResetForm(false);
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
    setActiveTab('predict');
    setResetForm(prev => !prev);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log('Saving draft...');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Downloading...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewPrediction={handleNewPrediction} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.user_metadata?.full_name || 'User'}
          </h1>
        </div>
        
        <Tabs defaultValue="predict" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="predict" className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              <span>Predict</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <PredictionForm onPredict={handlePredict} resetTrigger={resetForm} />
              </div>
              <div>
                {predictionResult ? (
                  <>
                    <ResultsDisplay result={predictionResult} similarCases={similarCases} crimeType={crimeType} />
                    <div className="mt-6 flex justify-end space-x-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSaveDraft}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Scale className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Prediction Yet</h3>
                      <p className="text-gray-500">
                        Submit a case to get a prediction and see detailed analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <PredictionHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
