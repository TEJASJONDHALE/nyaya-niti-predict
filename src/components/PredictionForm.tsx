import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { courts, caseTypes } from '@/utils/mockData';
import { PredictionResult } from '@/utils/mockData';
import { FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrediction } from '@/services/predictionService';

interface PredictionFormProps {
  onPredict: (result: PredictionResult, type: string) => void;
  resetTrigger: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, resetTrigger }) => {
  const [formData, setFormData] = useState({
    caseType: '',
    witnessCount: 0,
    firSection: ''
  });
  const [caseDescription, setCaseDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const crimeTypes = caseTypes.map(type => type.replace('Criminal - ', ''));
  
  useEffect(() => {
    if (resetTrigger) {
      setFormData({
        caseType: '',
        witnessCount: 0,
        firSection: ''
      });
      setCaseDescription('');
      setIsSubmitting(false);
    }
  }, [resetTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseDescription.trim()) {
      toast({
        title: 'Case Description Required',
        description: 'Please provide details about the case to generate a prediction.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.caseType) {
      toast({
        title: 'Crime Type Required',
        description: 'Please select the type of crime.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.witnessCount || formData.witnessCount < 0) {
      toast({
        title: 'Witness Count Required',
        description: 'Please enter the number of witnesses.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.firSection) {
      toast({
        title: 'FIR Section Required',
        description: 'Please enter the FIR section under which the case is registered.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await getPrediction(
        `Criminal - ${formData.caseType}`, 
        formData.witnessCount, 
        formData.firSection,
        caseDescription
      );
      
      if (!result) {
        throw new Error('Failed to get prediction');
      }
      
      onPredict(result, formData.caseType);
      
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
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caseDescription" className="flex items-center">
              Case Description <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="caseDescription"
              placeholder="Enter all relevant details about the case..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Provide specific details about the crime, circumstances, and FIR details for more accurate AI analysis
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="crimeType" className="flex items-center">
              Crime Type <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={formData.caseType} onValueChange={(value) => setFormData({ ...formData, caseType: value })} required>
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
            <Label htmlFor="witnessCount" className="flex items-center">
              Number of Witnesses <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="witnessCount"
              type="number"
              min="0"
              max="20"
              value={formData.witnessCount}
              onChange={(e) => setFormData({ ...formData, witnessCount: parseInt(e.target.value) })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firSection" className="flex items-center">
              FIR Section <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="firSection"
              placeholder="Enter FIR section (e.g., IPC 302)"
              value={formData.firSection}
              onChange={(e) => setFormData({ ...formData, firSection: e.target.value })}
              required
            />
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
