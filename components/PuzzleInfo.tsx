'use client'

import { Puzzle } from '@/types'
import { Icons } from '@/components/icons'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface PuzzleInfoProps {
  puzzle: Puzzle
  onSave?: () => void
}

export function PuzzleInfo({ puzzle, onSave }: PuzzleInfoProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Puzzle removed from bookmarks' : 'Puzzle added to bookmarks')
  }

  const handleSave = () => {
    onSave?.()
    toast.success('Puzzle progress saved')
  }

  return (
    <div className="flex items-center justify-between py-2 border-t border-b">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-xs font-medium">#{puzzle.id}</span>
        <span>•</span>
        <time dateTime={puzzle.date_published} className="text-xs">
          {new Date(puzzle.date_published).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
        <span>•</span>
        <span className="text-xs">{puzzle.author}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="text-muted-foreground hover:text-foreground"
        >
          {isBookmarked ? (
            <Icons.bookmarkCheck className="h-4 w-4" />
          ) : (
            <Icons.bookmark className="h-4 w-4" />
          )}
          <span className="ml-2 text-xs">Bookmark</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icons.save className="h-4 w-4" />
          <span className="ml-2 text-xs">Save Progress</span>
        </Button>
      </div>
    </div>
  )
}
