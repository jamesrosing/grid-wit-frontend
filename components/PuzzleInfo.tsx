'use client'

import { Puzzle } from '@/types'
import { Icons } from '@/components/icons'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/contexts/AuthContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import type { Database } from '@/lib/database.types'

interface PuzzleInfoProps {
  puzzle: Puzzle
  onSave?: () => void
}

interface PuzzleFavorite {
  user_id: string
  puzzle_id: string
  is_favorite: boolean
  created_at: string
}

export function PuzzleInfo({ puzzle, onSave }: PuzzleInfoProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function checkBookmarkStatus() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('puzzle_favorites')
          .select('is_favorite')
          .eq('user_id', user.id)
          .eq('puzzle_id', puzzle.id.toString())
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking bookmark status:', error)
          toast.error('Failed to load bookmark status')
          return
        }

        setIsBookmarked(data?.is_favorite || false)
      } catch (e) {
        console.error('Error in checkBookmarkStatus:', e)
        toast.error('Failed to load bookmark status')
      } finally {
        setLoading(false)
      }
    }

    checkBookmarkStatus()
  }, [puzzle.id, user, supabase])

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark puzzles')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('puzzle_favorites')
        .upsert({
          user_id: user.id,
          puzzle_id: puzzle.id.toString(),
          is_favorite: !isBookmarked,
          created_at: new Date().toISOString()
        } as PuzzleFavorite)

      if (error) throw error

      setIsBookmarked(!isBookmarked)
      toast.success(
        isBookmarked 
          ? 'Puzzle removed from bookmarks' 
          : 'Puzzle added to bookmarks'
      )
    } catch (e) {
      console.error('Error toggling bookmark:', e)
      toast.error('Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave()
      toast.success('Progress saved successfully')
    } catch (e) {
      console.error('Error saving progress:', e)
      toast.error('Failed to save progress')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div 
      className="flex items-center justify-between py-2 px-2 md:px-4 border-t border-b text-xs md:text-sm" 
      role="complementary" 
      aria-label="Puzzle information"
    >
      <div className="flex items-center gap-1 md:gap-2 text-muted-foreground">
        <span className="text-[10px] md:text-xs font-medium">#{puzzle.id}</span>
        <span aria-hidden="true">•</span>
        <time 
          dateTime={puzzle.date_published} 
          className="text-[10px] md:text-xs hidden sm:inline"
        >
          {new Date(puzzle.date_published).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
        <time 
          dateTime={puzzle.date_published} 
          className="text-[10px] md:text-xs sm:hidden"
        >
          {new Date(puzzle.date_published).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit'
          })}
        </time>
        <span aria-hidden="true">•</span>
        <span className="text-[10px] md:text-xs">by {puzzle.author}</span>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                disabled={loading}
                className="h-8 md:h-9 px-2 md:px-3 text-muted-foreground hover:text-foreground"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {loading ? (
                  <Icons.spinner className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                ) : isBookmarked ? (
                  <Icons.bookmarkCheck className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Icons.bookmark className="h-3 w-3 md:h-4 md:w-4" />
                )}
                <span className="ml-1 md:ml-2 text-[10px] md:text-xs hidden sm:inline">Bookmark</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !onSave}
                className="h-8 md:h-9 px-2 md:px-3 text-muted-foreground hover:text-foreground"
                aria-label="Save progress"
              >
                {isSaving ? (
                  <Icons.spinner className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                ) : (
                  <Icons.save className="h-3 w-3 md:h-4 md:w-4" />
                )}
                <span className="ml-1 md:ml-2 text-[10px] md:text-xs hidden sm:inline">Save Progress</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Save your current progress</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
