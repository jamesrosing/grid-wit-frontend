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
          progress: string[][]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          puzzle_id: string
          progress: string[][]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          puzzle_id?: string
          progress?: string[][]
          created_at?: string
          updated_at?: string
        }
      }
      puzzle_bookmarks: {
        Row: {
          id: string
          user_id: string
          puzzle_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          puzzle_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          puzzle_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
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
