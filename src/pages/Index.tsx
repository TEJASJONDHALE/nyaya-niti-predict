
import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import Header from '@/components/Header';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import PredictionHistory from '@/components/PredictionHistory';
import { PredictionResult } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const { signOut, user } = useAuth();

  const handlePredict = (result: PredictionResult) => {
    setPredictionResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.user_metadata?.full_name || 'User'}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="predict" className="space-y-6">
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
                <PredictionForm onPredict={handlePredict} />
              </div>
              <div>
                <ResultsDisplay result={predictionResult} />
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
