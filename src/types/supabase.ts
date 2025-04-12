
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          created_at: string
          case_number: string
          case_type: string
          court: string
          witness_count: number
          evidence_strength: string
          outcome: string | null
          confidence: number | null
          explanation: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          case_number: string
          case_type: string
          court: string
          witness_count: number
          evidence_strength: string
          outcome?: string | null
          confidence?: number | null
          explanation?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          case_number?: string
          case_type?: string
          court?: string
          witness_count?: number
          evidence_strength?: string
          outcome?: string | null
          confidence?: number | null
          explanation?: string | null
          user_id?: string | null
        }
      }
      prediction_factors: {
        Row: {
          id: string
          created_at: string
          case_id: string
          factor: string
          importance: number
        }
        Insert: {
          id?: string
          created_at?: string
          case_id: string
          factor: string
          importance: number
        }
        Update: {
          id?: string
          created_at?: string
          case_id?: string
          factor?: string
          importance?: number
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          role?: string
        }
      }
      case_data: {
        Row: {
          id: string
          created_at: string
          case_number: string
          judge_experience: number
          case_duration: number
          witness_count: number
          evidence_strength: string
          outcome: string
        }
        Insert: {
          id?: string
          created_at?: string
          case_number: string
          judge_experience: number
          case_duration: number
          witness_count: number
          evidence_strength: string
          outcome: string
        }
        Update: {
          id?: string
          created_at?: string
          case_number?: string
          judge_experience?: number
          case_duration?: number
          witness_count?: number
          evidence_strength?: string
          outcome?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      predict_outcome: {
        Args: {
          case_type: string
          witness_count: number
          evidence_strength: string
        }
        Returns: {
          outcome: string
          confidence: number
          explanation: string
          factors: Json
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
