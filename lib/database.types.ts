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
      puzzle_progress: {
        Row: {
          id: string
          user_id: string
          puzzle_id: string
          state: Json
          completed: boolean
          last_played_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          puzzle_id: string
          state: Json
          completed?: boolean
          last_played_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          puzzle_id?: string
          state?: Json
          completed?: boolean
          last_played_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
