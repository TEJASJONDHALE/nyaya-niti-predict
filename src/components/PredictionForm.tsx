import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { courts } from '@/utils/mockData';
import { PredictionResult } from '@/utils/mockData';
import { FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrediction } from '@/services/predictionService';

interface PredictionFormProps {
  onPredict: (result: PredictionResult, caseId?: string) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
  const [court, setCourt] = useState('');
  const [crimeType, setCrimeType] = useState('');
  const [witnessCount, setWitnessCount] = useState(3);
  const [firSection, setFirSection] = useState('');
  const [caseFacts, setCaseFacts] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const crimeTypes = [
    'Theft',
    'Assault',
    'Fraud',
    'Homicide',
    'Drug Possession',
  ];
  
  const firSections = [
    'IPC 302 - Murder',
    'IPC 376 - Rape',
    'IPC 379 - Theft',
    'IPC 420 - Cheating',
    'IPC 323 - Voluntarily causing hurt',
    'IPC 504 - Intentional insult',
    'NDPS Act 20 - Drug Possession',
    'IPC 307 - Attempt to murder',
    'IPC 406 - Criminal breach of trust',
    'IPC 498A - Cruelty by husband or relatives'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseFacts.trim()) {
      toast({
        title: 'Case Facts Required',
        description: 'Please provide details about the case to generate a prediction.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!firSection) {
      toast({
        title: 'FIR Section Required',
        description: 'Please select the FIR section under which the case is registered.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await getPrediction(
        `Criminal - ${crimeType}`, 
        witnessCount, 
        firSection,
        caseFacts
      );
      
      if (!result) {
        throw new Error('Failed to get prediction');
      }
      
      onPredict(result);
      
      toast({
        title: 'AI Prediction Generated',
        description: `Predicted outcome: ${result.outcome} with ${Math.round(result.confidence * 100)}% confidence`,
      });
    } catch (error) {
      console.error('Error during prediction:', error);
      toast({
        title: 'AI Prediction Failed',
        description: 'An error occurred while generating the prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="legal-card">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-legal-primary" />
          <CardTitle className="text-lg text-legal-primary">AI Legal Case Predictor</CardTitle>
        </div>
        <CardDescription>Enter case details to get an AI-powered prediction of the likely outcome</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caseFacts" className="flex items-center">
              Case Facts <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="caseFacts"
              placeholder="Enter all relevant details about the case..."
              value={caseFacts}
              onChange={(e) => setCaseFacts(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Provide specific details about the crime, circumstances, and FIR details for more accurate AI analysis
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="crimeType">Crime Type</Label>
            <Select value={crimeType} onValueChange={setCrimeType}>
              <SelectTrigger id="crimeType">
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent>
                {crimeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="witnessCount">Number of Witnesses</Label>
            <Input
              id="witnessCount"
              type="number"
              min="0"
              max="20"
              value={witnessCount}
              onChange={(e) => setWitnessCount(parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firSection" className="flex items-center">
              FIR Section <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={firSection} onValueChange={setFirSection}>
              <SelectTrigger id="firSection">
                <SelectValue placeholder="Select FIR section" />
              </SelectTrigger>
              <SelectContent>
                {firSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-legal-primary hover:bg-legal-primary/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Analyzing Case...'
            ) : (
              <>
                Generate AI Prediction <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
