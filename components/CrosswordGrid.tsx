'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { Puzzle, Cell, ActiveCell, GRID_SIZE, Clue } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  puzzle: Puzzle
  onCellSelect: (row: number, col: number, direction: 'across' | 'down') => void
  activeCell: ActiveCell | null
  activeClue: Clue | null
  userProgress: string[][]
  onUpdateProgress: (row: number, col: number, value: string) => void
}

export function CrosswordGrid({ 
  puzzle, 
  onCellSelect, 
  activeCell,
  activeClue,
  userProgress,
  onUpdateProgress 
}: Props) {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [direction, setDirection] = useState<'across' | 'down'>('across')

  function isStartOfAcross(grid: string[], row: number, col: number): boolean {
    const index = row * GRID_SIZE + col
    return grid[index] !== '.' && 
           (col === 0 || grid[index - 1] === '.') &&
           col < GRID_SIZE - 1 && 
           grid[index + 1] !== '.'
  }

  function isStartOfDown(grid: string[], row: number, col: number): boolean {
    const index = row * GRID_SIZE + col
    return grid[index] !== '.' && 
           (row === 0 || grid[index - GRID_SIZE] === '.') &&
           row < GRID_SIZE - 1 && 
           grid[index + GRID_SIZE] !== '.'
  }

  function getAvailableDirections(number: number): { across: boolean; down: boolean } {
    const acrossClue = puzzle.clues.find(c => c.number === number && c.direction === 'across')
    const downClue = puzzle.clues.find(c => c.number === number && c.direction === 'down')

    return {
      across: !!acrossClue,
      down: !!downClue
    }
  }

  const handleCellClick = (row: number, col: number, cell: Cell) => {
    if (cell.isBlack) return

    if (activeClue) {
      setDirection(activeClue.direction)
      onCellSelect(row, col, activeClue.direction)
      return
    }

    if (cell.number) {
      const availableDirections = getAvailableDirections(cell.number)

      if (availableDirections.across && availableDirections.down) {
        if (activeCell?.row === row && activeCell?.col === col) {
          const newDirection = direction === 'across' ? 'down' : 'across'
          setDirection(newDirection)
          onCellSelect(row, col, newDirection)
        } else {
          onCellSelect(row, col, direction)
        }
      } else if (availableDirections.across) {
        setDirection('across')
        onCellSelect(row, col, 'across')
      } else if (availableDirections.down) {
        setDirection('down')
        onCellSelect(row, col, 'down')
      }
    } else {
      const newDirection = activeClue?.direction || direction
      setDirection(newDirection)
      onCellSelect(row, col, newDirection)
    }
  }

  const handleCellInput = (row: number, col: number, value: string) => {
    if (grid[row][col].isBlack) return

    const newValue = value.toUpperCase().replace(/[^A-Z]/g, '')
    if (newValue) {
      onUpdateProgress(row, col, newValue)

      if (activeClue) {
        const movement = activeClue.direction === 'across' ? { rowDelta: 0, colDelta: 1 } : { rowDelta: 1, colDelta: 0 }
        moveToNextCell(row, col, movement.rowDelta, movement.colDelta)
      }
    }
  }

  const moveToNextCell = (row: number, col: number, rowDelta: number, colDelta: number) => {
    const newRow = row + rowDelta
    const newCol = col + colDelta

    if (
      newRow >= 0 && newRow < GRID_SIZE &&
      newCol >= 0 && newCol < GRID_SIZE &&
      !grid[newRow][newCol].isBlack
    ) {
      const moveDirection = activeClue ? activeClue.direction : direction
      onCellSelect(newRow, newCol, moveDirection)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (userProgress[row][col]) {
        onUpdateProgress(row, col, '')
      } else {
        const movement = activeClue?.direction === 'across' ? { rowDelta: 0, colDelta: -1 } : { rowDelta: -1, colDelta: 0 }
        moveToNextCell(row, col, movement.rowDelta, movement.colDelta)
      }
    } else if (e.key === 'Delete') {
      e.preventDefault()
      onUpdateProgress(row, col, '')
    } else if (e.key === 'ArrowRight') {
      moveToNextCell(row, col, 0, 1)
      setDirection('across')
    } else if (e.key === 'ArrowLeft') {
      moveToNextCell(row, col, 0, -1)
      setDirection('across')
    } else if (e.key === 'ArrowDown') {
      moveToNextCell(row, col, 1, 0)
      setDirection('down')
    } else if (e.key === 'ArrowUp') {
      moveToNextCell(row, col, -1, 0)
      setDirection('down')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      moveToNextWord()
    }
  }

  useEffect(() => {
    const rawGrid: string[] = JSON.parse(puzzle.grid)
    const cells: Cell[][] = []
    let cellNumber = 1

    for (let row = 0; row < GRID_SIZE; row++) {
      cells[row] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        const index = row * GRID_SIZE + col
        const value = rawGrid[index]
        const isStartOfWord = isStartOfAcross(rawGrid, row, col) || 
                            isStartOfDown(rawGrid, row, col)

        cells[row][col] = {
          value,
          isBlack: value === '.',
          row,
          col,
          number: isStartOfWord ? cellNumber++ : undefined,
          isStart: {
            across: isStartOfAcross(rawGrid, row, col),
            down: isStartOfDown(rawGrid, row, col)
          }
        }
      }
    }
    setGrid(cells)
  }, [puzzle])

  function isPartOfActiveClue(row: number, col: number): boolean {
    if (!activeClue || !activeCell) return false

    if (activeClue.direction === 'across') {
      return row === activeClue.row && 
             col >= activeClue.column && 
             col < activeClue.column + activeClue.answer.length &&
             !hasNumberBetween(activeClue.column, col, row, 'across')
    } else {
      return col === activeClue.column && 
             row >= activeClue.row && 
             row < activeClue.row + activeClue.answer.length &&
             !hasNumberBetween(activeClue.row, row, col, 'down')
    }
  }

  function hasNumberBetween(start: number, end: number, fixed: number, direction: 'across' | 'down'): boolean {
    const min = Math.min(start, end)
    const max = Math.max(start, end)

    for (let i = min + 1; i < max; i++) {
      const cell = direction === 'across' 
        ? grid[fixed][i]
        : grid[i][fixed]

      if (cell?.number) return true
    }
    return false
  }

  return (
    <div className="w-full max-w-[min(90vw,600px)] aspect-square">
      <div 
        className="grid gap-px bg-zinc-200 border border-zinc-300 h-full" 
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={cn(
                "relative flex items-center justify-center",
                cell.isBlack ? "bg-black" : "bg-white",
                activeCell?.row === i && activeCell?.col === j && "bg-zinc-200",
                isPartOfActiveClue(i, j) && "bg-zinc-100",
                !cell.isBlack && "hover:bg-zinc-50",
                "aspect-square text-center cursor-pointer"
              )}
              onClick={() => handleCellClick(i, j, cell)}
            >
              {cell.number && (
                <span className="absolute top-0.5 left-0.5 text-[6px] md:text-[8px] font-normal text-black">
                  {cell.number}
                </span>
              )}
              {!cell.isBlack && (
                <input
                  type="text"
                  maxLength={1}
                  value={userProgress[i][j] || ''}
                  onChange={(e) => handleCellInput(i, j, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i, j)}
                  className="w-full h-full text-center text-base md:text-lg font-medium text-black bg-transparent focus:outline-none"
                  style={{ caretColor: 'transparent' }}
                  ref={activeCell?.row === i && activeCell?.col === j ? (el) => el?.focus() : null}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
