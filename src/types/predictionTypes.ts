export interface PredictionFactor {
  factor: string;
  importance: number;
  reference?: string;
}

export interface PredictionResult {
  outcome: string;
  confidence: number;
  explanation: string;
  factors: PredictionFactor[];
} 