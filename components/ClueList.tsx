'use client'

import { Clue } from '@/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  clues: Clue[]
  activeClue: Clue | null
  onClueSelect: (clue: Clue) => void
}

export function ClueList({ clues, activeClue, onClueSelect }: Props) {
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')

  // Sort clues by number
  const acrossClues = clues
    .filter(clue => clue.direction === 'across')
    .sort((a, b) => a.number - b.number)

  const downClues = clues
    .filter(clue => clue.direction === 'down')
    .sort((a, b) => a.number - b.number)

  return (
    <div className="flex flex-col h-full">
      {/* Direction Tabs - Mobile Only */}
      <div className="flex gap-8 mb-4 border-b border-zinc-200 lg:hidden">
        <button
          onClick={() => setSelectedDirection('across')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            selectedDirection === 'across' 
              ? "text-zinc-900 border-b-2 border-zinc-900" 
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Across
        </button>
        <button
          onClick={() => setSelectedDirection('down')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            selectedDirection === 'down' 
              ? "text-zinc-900 border-b-2 border-zinc-900" 
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Down
        </button>
      </div>

      {/* Clue Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Across Clues */}
        <div className={cn(
          selectedDirection === 'across' || 'hidden lg:block'
        )}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block">Across</h3>
          <div className="space-y-1">
            {acrossClues.map(clue => (
              <button
                key={`across-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'across'
                    ? 'bg-zinc-100' 
                    : 'hover:bg-zinc-50',
                  "transition-colors"
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                <span className="text-zinc-800">{clue.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div className={cn(
          selectedDirection === 'down' || 'hidden lg:block'
        )}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block">Down</h3>
          <div className="space-y-1">
            {downClues.map(clue => (
              <button
                key={`down-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'down'
                    ? 'bg-zinc-100' 
                    : 'hover:bg-zinc-50',
                  "transition-colors"
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                <span className="text-zinc-800">{clue.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}