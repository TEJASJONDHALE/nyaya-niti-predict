
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useModelTraining = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelTrained, setModelTrained] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const { toast } = useToast();

  const handleTrainModel = async () => {
    if (!csvFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a CSV file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate ML model training process
      toast({
        title: 'Training Started',
        description: 'The ML model training process has started.',
      });

      // Simulate progress updates
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Simulate API delay for model training
      setTimeout(() => {
        clearInterval(interval);
        setTrainingProgress(100);
        
        // Generate random accuracy between 75-95%
        const accuracy = 75 + Math.random() * 20;
        setModelAccuracy(parseFloat(accuracy.toFixed(2)));
        
        setIsTraining(false);
        setModelTrained(true);
        
        toast({
          title: 'Training Completed',
          description: `Model trained successfully with ${accuracy.toFixed(2)}% accuracy.`,
        });
      }, 8000);
      
    } catch (error) {
      console.error('Error during model training:', error);
      toast({
        title: 'Training Failed',
        description: 'An error occurred during the model training process.',
        variant: 'destructive',
      });
      setIsTraining(false);
    }
  };

  const handleUseForPredictions = () => {
    toast({
      title: "Model Ready",
      description: "The model is now ready for predictions. You can use it in the Prediction Form."
    });
  };

  return {
    csvFile,
    setCsvFile,
    isTraining,
    trainingProgress,
    modelTrained,
    modelAccuracy,
    handleTrainModel,
    handleUseForPredictions
  };
};
