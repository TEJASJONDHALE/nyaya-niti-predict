export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      case_data: {
        Row: {
          case_duration: number | null
          case_number: string
          created_at: string
          evidence_strength: string
          id: string
          judge_experience: number | null
          outcome: string
          witness_count: number
        }
        Insert: {
          case_duration?: number | null
          case_number: string
          created_at?: string
          evidence_strength: string
          id?: string
          judge_experience?: number | null
          outcome: string
          witness_count: number
        }
        Update: {
          case_duration?: number | null
          case_number?: string
          created_at?: string
          evidence_strength?: string
          id?: string
          judge_experience?: number | null
          outcome?: string
          witness_count?: number
        }
        Relationships: []
      }
      cases: {
        Row: {
          case_number: string
          case_type: string
          confidence: number | null
          court: string
          created_at: string
          evidence_strength: string
          explanation: string | null
          id: string
          outcome: string | null
          user_id: string | null
          witness_count: number
        }
        Insert: {
          case_number: string
          case_type: string
          confidence?: number | null
          court: string
          created_at?: string
          evidence_strength: string
          explanation?: string | null
          id?: string
          outcome?: string | null
          user_id?: string | null
          witness_count: number
        }
        Update: {
          case_number?: string
          case_type?: string
          confidence?: number | null
          court?: string
          created_at?: string
          evidence_strength?: string
          explanation?: string | null
          id?: string
          outcome?: string | null
          user_id?: string | null
          witness_count?: number
        }
        Relationships: []
      }
      outcome_explanations: {
        Row: {
          case_id: string
          created_at: string
          factor_explanation: string
          factor_name: string
          factor_weight: number
          id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          factor_explanation: string
          factor_name: string
          factor_weight: number
          id?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          factor_explanation?: string
          factor_name?: string
          factor_weight?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcome_explanations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_factors: {
        Row: {
          case_id: string
          created_at: string
          factor: string
          id: string
          importance: number
        }
        Insert: {
          case_id: string
          created_at?: string
          factor: string
          id?: string
          importance: number
        }
        Update: {
          case_id?: string
          created_at?: string
          factor?: string
          id?: string
          importance?: number
        }
        Relationships: [
          {
            foreignKeyName: "prediction_factors_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_factor_explanations: {
        Args: {
          p_case_id: string
          p_case_type: string
          p_witness_count: number
          p_evidence_strength: string
        }
        Returns: {
          case_id: string
          created_at: string
          factor_explanation: string
          factor_name: string
          factor_weight: number
          id: string
        }[]
      }
      predict_outcome: {
        Args: {
          case_type: string
          witness_count: number
          evidence_strength: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
