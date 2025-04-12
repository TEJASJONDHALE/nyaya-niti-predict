
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserCases } from '@/services/predictionService';
import { FileText, ChevronRight, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type CasePrediction = {
  id: string;
  created_at: string;
  case_number: string;
  case_type: string;
  court: string;
  outcome: string;
  confidence: number;
  prediction_factors: {
    factor: string;
    importance: number;
  }[];
};

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState<CasePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        <CardDescription>Your recent case predictions</CardDescription>
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
              
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  View Details <ChevronRight className="h-3 w-3 ml-1" />
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
