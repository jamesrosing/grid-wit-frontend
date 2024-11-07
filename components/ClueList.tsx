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

  const acrossClues = clues
    .filter(clue => clue.direction === 'across')
    .sort((a, b) => a.number - b.number)

  const downClues = clues
    .filter(clue => clue.direction === 'down')
    .sort((a, b) => a.number - b.number)

  return (
    <div className="bg-zinc-900 text-zinc-50 p-4 rounded-lg">
      {/* Direction Tabs - Mobile Only */}
      <div className="flex gap-8 mb-4 border-b border-zinc-800 lg:hidden">
        <button
          onClick={() => setSelectedDirection('across')}
          className={cn(
            "pb-2 text-sm font-medium",
            selectedDirection === 'across' 
              ? "text-zinc-50 border-b-2 border-zinc-50" 
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          Across
        </button>
        <button
          onClick={() => setSelectedDirection('down')}
          className={cn(
            "pb-2 text-sm font-medium",
            selectedDirection === 'down' 
              ? "text-zinc-50 border-b-2 border-zinc-50" 
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          Down
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Across Clues */}
        <div className={selectedDirection === 'across' ? 'block' : 'hidden lg:block'}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block">Across</h3>
          <div className="space-y-1">
            {acrossClues.map(clue => (
              <button
                key={`across-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'across'
                    ? 'bg-zinc-800' 
                    : 'hover:bg-zinc-800/50'
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                {clue.text}
              </button>
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div className={selectedDirection === 'down' ? 'block' : 'hidden lg:block'}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block">Down</h3>
          <div className="space-y-1">
            {downClues.map(clue => (
              <button
                key={`down-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'down'
                    ? 'bg-zinc-800' 
                    : 'hover:bg-zinc-800/50'
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2">{clue.number}.</span>
                {clue.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}