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
          id: number
          puzzle_id: string
          user_id: string
          state: Json
          completed: boolean
          created_at: string
          last_played_at: string
        }
        Insert: {
          id?: number
          puzzle_id: string
          user_id: string
          state: Json
          completed?: boolean
          created_at?: string
          last_played_at?: string
        }
        Update: {
          id?: number
          puzzle_id?: string
          user_id?: string
          state?: Json
          completed?: boolean
          created_at?: string
          last_played_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzle_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      [key: string]: never
    }
  }
}
