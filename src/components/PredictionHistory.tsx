
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserCases, deleteCasePrediction, getExplanationsForCase } from '@/services/predictionService';
import { FileText, ChevronRight, Clock, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ExplanationDetail from './ExplanationDetail';

type CasePrediction = {
  id: string;
  created_at: string;
  case_number: string;
  case_type: string;
  court: string;
  outcome: string;
  confidence: number;
  witness_count: number;
  evidence_strength: string;
  prediction_factors: {
    factor: string;
    importance: number;
  }[];
};

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState<CasePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [explanations, setExplanations] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const cases = await getUserCases();
        if (cases) {
          setPredictions(cases as unknown as CasePrediction[]);
        }
      } catch (error) {
        console.error('Error fetching prediction history:', error);
        toast({
          title: 'Failed to load predictions',
          description: 'Could not retrieve your prediction history.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [toast]);

  const handleDeletePrediction = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await deleteCasePrediction(id);
      if (result.success) {
        setPredictions(predictions.filter(p => p.id !== id));
        toast({
          title: 'Prediction Deleted',
          description: 'The prediction has been deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete prediction');
      }
    } catch (error) {
      console.error('Error deleting prediction:', error);
      toast({
        title: 'Delete Failed',
        description: 'Could not delete the prediction.',
        variant: 'destructive',
      });
    }
  };

  const handleViewExplanation = async (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsLoadingExplanation(true);
    
    try {
      const data = await getExplanationsForCase(caseId);
      setExplanations(data);
    } catch (error) {
      console.error('Error loading explanations:', error);
      toast({
        title: 'Failed to Load Explanation',
        description: 'Could not retrieve the detailed explanation.',
        variant: 'destructive',
      });
      
      // Use mock data as fallback
      setExplanations([
        {
          factor_name: "Witness Count",
          factor_explanation: "The number of witnesses in this case has a significant impact on the credibility of testimony.",
          factor_weight: 0.7
        },
        {
          factor_name: "Evidence Strength",
          factor_explanation: "The quality and quantity of evidence presented strongly influences the case outcome.",
          factor_weight: 0.8
        }
      ]);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getOutcomeColorClass = (outcome: string) => {
    switch (outcome) {
      case 'Conviction': return 'text-red-600';
      case 'Acquittal': return 'text-green-600';
      case 'Settlement': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading prediction history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500 mb-2">No prediction history found</p>
            <p className="text-gray-400 text-sm">
              Generate your first case prediction to see it here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" /> Prediction History
        </CardTitle>
        <CardDescription>Your recent case predictions with detailed explanations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div 
              key={prediction.id} 
              className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{prediction.case_number}</h4>
                  <p className="text-sm text-gray-500">{prediction.case_type} • {prediction.court}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Witnesses: {prediction.witness_count} • Evidence: {prediction.evidence_strength}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getOutcomeColorClass(prediction.outcome)}`}>
                    {prediction.outcome}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(prediction.created_at), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 text-sm">
                <p className="font-medium text-gray-700">Top factors:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {prediction.prediction_factors.slice(0, 2).map((factor, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {factor.factor}
                    </span>
                  ))}
                  {prediction.prediction_factors.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      +{prediction.prediction_factors.length - 2} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleViewExplanation(prediction.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View AI Explanation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Detailed AI Explanation</DialogTitle>
                      <DialogDescription>
                        Analysis of factors affecting the case outcome prediction
                      </DialogDescription>
                    </DialogHeader>
                    {isLoadingExplanation ? (
                      <div className="flex justify-center items-center py-10">
                        <p>Loading detailed explanation...</p>
                      </div>
                    ) : (
                      <ExplanationDetail factors={explanations} />
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDeletePrediction(prediction.id, e)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionHistory;
