
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { caseTypes, courts } from '@/utils/mockData';
import { PredictionResult } from '@/utils/mockData';
import { FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrediction, saveCasePrediction } from '@/services/predictionService';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase';

interface PredictionFormProps {
  onPredict: (result: PredictionResult, caseId?: string) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
  const [caseNumber, setCaseNumber] = useState('');
  const [caseType, setCaseType] = useState('');
  const [court, setCourt] = useState('');
  const [witnessCount, setWitnessCount] = useState(3);
  const [evidenceStrength, setEvidenceStrength] = useState('Moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get prediction from our backend service
      const result = await getPrediction(caseType, witnessCount, evidenceStrength);
      
      if (!result) {
        throw new Error('Failed to get prediction');
      }
      
      let caseId;
      
      // Save the case and prediction to the database
      const saveResult = await saveCasePrediction(
        { caseNumber, caseType, court, witnessCount, evidenceStrength }, 
        result
      );
      
      if (saveResult.success) {
        caseId = saveResult.caseId;
        
        // If Supabase is configured and we have a case ID, generate detailed explanations
        if (isSupabaseConfigured() && caseId) {
          try {
            await supabase.rpc('generate_factor_explanations', {
              p_case_id: caseId,
              p_case_type: caseType,
              p_witness_count: witnessCount,
              p_evidence_strength: evidenceStrength
            });
          } catch (error) {
            console.error('Error generating detailed explanation:', error);
            // Non-critical error, so we continue
          }
        }
      } else {
        console.warn('Prediction was generated but not saved to database');
      }
      
      // Pass the caseId to allow fetching detailed explanations
      onPredict(result, caseId);
      
      toast({
        title: 'Prediction Generated',
        description: `Predicted outcome: ${result.outcome}`,
      });
    } catch (error) {
      console.error('Error during prediction:', error);
      toast({
        title: 'Prediction Failed',
        description: 'An error occurred while generating the prediction.',
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
          <CardTitle className="text-lg text-legal-primary">New Case Prediction</CardTitle>
        </div>
        <CardDescription>Enter case details to predict the outcome</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber">Case Number</Label>
              <Input 
                id="caseNumber"
                placeholder="e.g. CR-2023-1234" 
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="court">Court</Label>
              <Select value={court} onValueChange={setCourt} required>
                <SelectTrigger id="court">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caseType">Case Type</Label>
            <Select value={caseType} onValueChange={setCaseType} required>
              <SelectTrigger id="caseType">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {caseTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="witnessCount">Number of Witnesses: {witnessCount}</Label>
            </div>
            <Slider
              id="witnessCount"
              min={0}
              max={10}
              step={1}
              value={[witnessCount]}
              onValueChange={(value) => setWitnessCount(value[0])}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidenceStrength">Evidence Strength</Label>
            <Select value={evidenceStrength} onValueChange={setEvidenceStrength}>
              <SelectTrigger id="evidenceStrength">
                <SelectValue placeholder="Select evidence strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Strong">Strong</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Weak">Weak</SelectItem>
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
                Generate Prediction <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
