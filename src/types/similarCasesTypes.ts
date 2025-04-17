
export interface SimilarCase {
  id: string;
  title: string;
  court: string;
  date: string;
  outcome: string;
  crimeType: string;
  relevance: number;
  keyFacts: string[];
}

export interface CasesResponse {
  cases: SimilarCase[];
  [key: string]: any;
}

export type AIResponse = SimilarCase[] | CasesResponse | Record<string, unknown>;

export interface SimilarCasesDisplayProps {
  outcome: string;
}

// Data source type
export type DataSource = 'AI' | 'Mock';
