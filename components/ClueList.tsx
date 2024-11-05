'use client'

import { Clue } from '@/types'

interface Props {
  clues: Clue[]
  activeClue: Clue | null
  onClueSelect: (clue: Clue) => void
}

export function ClueList({ clues, activeClue, onClueSelect }: Props) {
  // Sort clues by number
  const acrossClues = clues
    .filter(clue => clue.direction === 'across')
    .sort((a, b) => a.number - b.number)

  const downClues = clues
    .filter(clue => clue.direction === 'down')
    .sort((a, b) => a.number - b.number)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Across Clues */}
      <div>
        <h3 className="font-bold mb-4 text-lg">Across</h3>
        <div className="space-y-1">
          {acrossClues.map(clue => (
            <button
              key={`across-${clue.number}`}
              className={`w-full text-left px-2 py-1 rounded text-black text-xs
                ${activeClue?.number === clue.number && activeClue.direction === 'across'
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'}`}
              onClick={() => onClueSelect(clue)}
            >
              <span className="font-bold mr-2">{clue.number}.</span>
              <span className="text-gray-800">{clue.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Down Clues */}
      <div>
        <h3 className="font-bold mb-4 text-lg">Down</h3>
        <div className="space-y-1">
          {downClues.map(clue => (
            <button
              key={`down-${clue.number}`}
              className={`w-full text-left px-2 py-1 rounded text-black text-xs
                ${activeClue?.number === clue.number && activeClue.direction === 'down'
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'}`}
              onClick={() => onClueSelect(clue)}
            >
              <span className="font-bold mr-2">{clue.number}.</span>
              <span className="text-gray-800">{clue.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}