export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Puzzle {
  id: string
  title: string
  author: string
  date: string
  grid: string[][] | string
  clues: Array<{
    number: number
    text: string
    direction: 'across' | 'down'
    row: number
    column: number
    answer: string
  }>
}

export interface Bookmark {
  id: string
  user_id: string
  puzzle_id: string
  puzzle: Puzzle
  is_favorite: boolean
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      puzzles: {
        Row: {
          id: string
          title: string
          author: string
          date: string
          grid: string
          clues: Json
        }
        Insert: {
          id: string
          title: string
          author: string
          date: string
          grid: string
          clues: Json
        }
        Update: {
          id?: string
          title?: string
          author?: string
          date?: string
          grid?: string
          clues?: Json
        }
      }
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
      puzzle_favorites: {
        Row: {
          user_id: string
          puzzle_id: string
          is_favorite: boolean
          created_at: string
          puzzle: Puzzle
        }
        Insert: {
          user_id: string
          puzzle_id: string
          is_favorite: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          puzzle_id?: string
          is_favorite?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzle_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "puzzle_favorites_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
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
