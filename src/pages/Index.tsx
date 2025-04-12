
import React, { useState } from 'react';
import Header from '@/components/Header';
import PredictionForm from '@/components/PredictionForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import Dashboard from '@/components/Dashboard';
import CaseHistory from '@/components/CaseHistory';
import { PredictionResult } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, FileText, BarChart3 } from 'lucide-react';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  
  const handlePredict = (result: PredictionResult) => {
    setPredictionResult(result);
    
    // Scroll to results if on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const resultsElement = document.getElementById('prediction-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-legal-primary mb-2">Nyaya-Niti Predict</h1>
        <p className="text-gray-600 mb-6">
          AI-powered legal case outcome prediction system for Indian courts
        </p>
        
        <Tabs defaultValue="predict" className="space-y-6">
          <TabsList>
            <TabsTrigger value="predict" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Case Prediction
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center">
              <Layout className="mr-2 h-4 w-4" />
              Data Pipeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PredictionForm onPredict={handlePredict} />
              
              <div id="prediction-results">
                <ResultsDisplay result={predictionResult} />
              </div>
            </div>
            
            <CaseHistory />
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="pipeline">
            <div className="legal-card p-6">
              <h2 className="legal-header">Data Pipeline Overview</h2>
              
              <div className="space-y-8">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-legal-primary mb-2">
                    Data Collection
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Automated scraping system for gathering case data from official court repositories using the openjustice-in/ecourts scraper.
                  </p>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <p className="text-sm text-gray-700 font-mono">
                      $ python scraper.py --courts=all --case-type=criminal --limit=10000
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status: <span className="text-green-600">✓ 10,000 cases collected</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-legal-primary mb-2">
                    Data Processing
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Automated text analysis to extract key metrics from case documents.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <p className="font-medium text-gray-700">Case Duration</p>
                      <p className="text-sm text-gray-600">Filing to judgment days</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Status: <span className="text-green-600">✓ Extracted</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <p className="font-medium text-gray-700">Witness Count</p>
                      <p className="text-sm text-gray-600">From judgment text</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Status: <span className="text-green-600">✓ Extracted</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <p className="font-medium text-gray-700">Judge Experience</p>
                      <p className="text-sm text-gray-600">Years on bench</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Status: <span className="text-green-600">✓ Extracted</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-legal-primary mb-2">
                    AI Training
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Model training on processed case data to predict outcomes.
                  </p>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-700">Training Progress</p>
                      <p className="text-sm text-green-600">100% Complete</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Accuracy:</span> 87.5%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-legal-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-legal-accent" />
                <span className="font-bold">Nyaya-Niti Predict</span>
              </div>
              <p className="text-sm opacity-75 mt-1">
                AI-powered legal prediction for Indian courts
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm opacity-75">
                Demonstration Interface Only
              </p>
              <p className="text-xs opacity-50 mt-1">
                ©2025 All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
