
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw } from 'lucide-react';

const CaseScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalCases, setTotalCases] = useState(10000);
  const [caseType, setCaseType] = useState('criminal');
  const [csvData, setCsvData] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsLoading(true);
    setProgress(0);
    setCsvData(null);
    
    try {
      // In a real implementation, we would connect to a scraping service
      // Since web scraping is complex and requires backend services, we'll simulate it
      toast({
        title: "Starting scraping process",
        description: `Preparing to scrape ${totalCases} ${caseType} cases from eCourts.`,
      });

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (totalCases / 100));
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);

      // Simulate API delay
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        
        // Generate sample CSV data (in a real app, this would come from the scraper)
        const headers = "case_id,case_type,court_name,filing_date,decision_date,judge_name,num_witnesses,evidence_strength,case_duration,outcome\n";
        let rows = [];
        
        for (let i = 1; i <= Math.min(totalCases, 100); i++) {
          const courtNames = ["Delhi High Court", "Mumbai High Court", "Chennai High Court", "Kolkata High Court"];
          const judges = ["Justice Kumar", "Justice Singh", "Justice Patel", "Justice Reddy"];
          const outcomes = ["Convicted", "Acquitted", "Settled", "Dismissed"];
          const evidenceStrengths = ["Strong", "Moderate", "Weak"];
          
          const filingDate = new Date(2018 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
          const durationMonths = Math.floor(Math.random() * 36) + 1;
          const decisionDate = new Date(filingDate);
          decisionDate.setMonth(filingDate.getMonth() + durationMonths);
          
          rows.push([
            `CRIM-${2018 + Math.floor(Math.random() * 5)}-${10000 + i}`,
            caseType,
            courtNames[Math.floor(Math.random() * courtNames.length)],
            filingDate.toISOString().split('T')[0],
            decisionDate.toISOString().split('T')[0],
            judges[Math.floor(Math.random() * judges.length)],
            Math.floor(Math.random() * 10) + 1,
            evidenceStrengths[Math.floor(Math.random() * evidenceStrengths.length)],
            durationMonths,
            outcomes[Math.floor(Math.random() * outcomes.length)]
          ].join(','));
        }
        
        const csvContent = headers + rows.join('\n');
        setCsvData(csvContent);
        
        setIsLoading(false);
        toast({
          title: "Scraping completed",
          description: `Successfully generated CSV data for ${Math.min(totalCases, 100)} cases (limited for demo).`,
        });
      }, 5000);
      
    } catch (error) {
      console.error('Error during scraping:', error);
      toast({
        title: 'Scraping Failed',
        description: 'An error occurred during the scraping process.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!csvData) return;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ecourts_cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <CardTitle className="text-lg">eCourts Case Scraper</CardTitle>
        <CardDescription>Scrape case data from eCourts for ML training</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="caseType" className="text-sm font-medium">Case Type</label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger id="caseType">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="totalCases" className="text-sm font-medium">Number of Cases</label>
              <Input 
                id="totalCases"
                type="number" 
                value={totalCases}
                onChange={(e) => setTotalCases(parseInt(e.target.value))}
                min="1"
                max="10000"
              />
            </div>
          </div>
          
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scraping Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Button
              onClick={handleScrape}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                'Start Scraping'
              )}
            </Button>
            
            {csvData && (
              <Button 
                variant="outline" 
                onClick={handleDownloadCSV}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseScraper;
