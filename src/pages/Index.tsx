
import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import PredictionHistory from '@/components/PredictionHistory';
import CaseScraper from '@/components/CaseScraper';
import MLModelTraining from '@/components/MLModelTraining';
import { PredictionResult } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, FileText, BarChart3, History, Database } from 'lucide-react';
import { Scale } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [modelTrained, setModelTrained] = useState(false);
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
            <TabsTrigger value="scrape" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Data Collection</span>
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>ML Training</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <PredictionForm onPredict={handlePredict} modelTrained={modelTrained} />
              </div>
              <div>
                <ResultsDisplay result={predictionResult} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scrape">
            <CaseScraper />
          </TabsContent>
          
          <TabsContent value="train">
            <MLModelTraining />
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Dashboard />
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
