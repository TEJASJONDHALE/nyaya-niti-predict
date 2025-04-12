
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, PieChart, PieArcSeries } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { statisticsData } from '@/utils/mockData';
import { Award, Calendar, Clock, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Extract data for charts
  const { casesByOutcome, averageDurationByType, accuracyByCourtType, topFactors } = statisticsData;
  
  // Prepare data for outcome pie chart
  const outcomeData = Object.entries(casesByOutcome).map(([key, value]) => ({
    name: key, 
    value
  }));
  
  // Prepare data for duration bar chart
  const durationData = Object.entries(averageDurationByType).map(([key, value]) => ({
    name: key.replace('Criminal - ', ''), 
    value
  }));
  
  // Prepare data for accuracy area chart
  const accuracyData = Object.entries(accuracyByCourtType).map(([key, value]) => ({
    name: key,
    value: value * 100
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="legal-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cases</p>
                <h3 className="text-2xl font-bold text-legal-primary mt-1">10,000+</h3>
              </div>
              <div className="bg-legal-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-legal-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={100} className="h-1" />
              <p className="text-xs text-gray-500 mt-1">100% data processed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="legal-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Case Duration</p>
                <h3 className="text-2xl font-bold text-legal-primary mt-1">167 days</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={70} className="h-1 bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">30% faster than average</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="legal-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Prediction Accuracy</p>
                <h3 className="text-2xl font-bold text-legal-primary mt-1">87.5%</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={87.5} className="h-1 bg-green-100" />
              <p className="text-xs text-gray-500 mt-1">Above target (85%)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="legal-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Processing Time</p>
                <h3 className="text-2xl font-bold text-legal-primary mt-1">2.3 sec</h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={90} className="h-1 bg-purple-100" />
              <p className="text-xs text-gray-500 mt-1">Optimized for quick results</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="legal-card">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-legal-primary" />
              <CardTitle className="text-md">Case Outcomes</CardTitle>
            </div>
            <CardDescription>Distribution of case resolutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PieChart data={outcomeData} valueFormatter={(value) => `${value} cases`}>
                <PieArcSeries />
              </PieChart>
            </div>
          </CardContent>
        </Card>
        
        <Card className="legal-card">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-legal-primary" />
              <CardTitle className="text-md">Case Duration by Type</CardTitle>
            </div>
            <CardDescription>Average days to resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart 
                data={durationData}
                valueFormatter={(value) => `${value} days`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="legal-card">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-legal-primary" />
            <CardTitle className="text-md">Top Prediction Factors</CardTitle>
          </div>
          <CardDescription>Factors with highest influence on case outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFactors.map((factor, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{factor.factor}</span>
                  <span className="text-sm text-gray-500">{Math.round(factor.importance * 100)}% influence</span>
                </div>
                <Progress 
                  value={factor.importance * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
