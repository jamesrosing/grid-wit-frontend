'use client'

import { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Puzzle, Cell, ActiveCell, GRID_SIZE, Clue } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  puzzle: Puzzle
  onCellSelect: (row: number, col: number, direction: 'across' | 'down') => void
  activeCell: ActiveCell | null
  activeClue: {
    direction: 'across' | 'down'
    number: number
    row: number
    column: number
    answer: string
  } | null
  userProgress: string[][]
  onUpdateProgress: (row: number, col: number, value: string) => void
}

interface Movement {
  rowDelta: number
  colDelta: number
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
      const defaultDirection: 'across' | 'down' = direction
      const currentDirection = (activeClue?.direction as 'across' | 'down' | undefined) || defaultDirection
      setDirection(currentDirection)
      onCellSelect(row, col, currentDirection)
    }
  }

  const handleCellInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Disable onChange handler since we're handling all input through onKeyDown
    return
  }

  const moveToNextCell = (row: number, col: number, rowDelta: number, colDelta: number) => {
    const newRow = row + rowDelta
    const newCol = col + colDelta

    if (
      newRow >= 0 && newRow < GRID_SIZE &&
      newCol >= 0 && newCol < GRID_SIZE &&
      !grid[newRow][newCol].isBlack
    ) {
      const moveDirection = (activeClue?.direction as 'across' | 'down' | undefined) || direction
      onCellSelect(newRow, newCol, moveDirection)
    }
  }

  const moveToNextWord = () => {
    if (!activeClue || !activeCell) return

    const currentNumber = activeClue.number
    const currentDirection = activeClue.direction
    
    const nextClue = puzzle.clues.find(clue => 
      clue.direction === currentDirection && 
      clue.number > currentNumber
    ) || puzzle.clues.find(clue => 
      clue.direction === currentDirection
    )

    if (nextClue) {
      onCellSelect(nextClue.row, nextClue.column, currentDirection)
    }
  }

  const moveToPreviousWord = () => {
    if (!activeClue || !activeCell) return

    const currentNumber = activeClue.number
    const currentDirection = activeClue.direction
    
    const prevClue = [...puzzle.clues]
      .reverse()
      .find(clue => 
        clue.direction === currentDirection && 
        clue.number < currentNumber
      ) || [...puzzle.clues]
      .reverse()
      .find(clue => 
        clue.direction === currentDirection
      )

    if (prevClue) {
      onCellSelect(prevClue.row, prevClue.column, currentDirection)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    // Always prevent default behavior to ensure consistent handling
    e.preventDefault()

    // Handle special keys
    switch (e.key) {
      case 'Backspace':
        if (userProgress[row][col]) {
          onUpdateProgress(row, col, '')
        } else {
          const movement: Movement = (activeClue?.direction as 'across' | 'down') === 'across' 
            ? { rowDelta: 0, colDelta: -1 } 
            : { rowDelta: -1, colDelta: 0 }
          moveToNextCell(row, col, movement.rowDelta, movement.colDelta)
        }
        break

      case 'Delete':
        onUpdateProgress(row, col, '')
        break

      case 'ArrowRight':
        moveToNextCell(row, col, 0, 1)
        setDirection('across')
        break

      case 'ArrowLeft':
        moveToNextCell(row, col, 0, -1)
        setDirection('across')
        break

      case 'ArrowDown':
        moveToNextCell(row, col, 1, 0)
        setDirection('down')
        break

      case 'ArrowUp':
        moveToNextCell(row, col, -1, 0)
        setDirection('down')
        break

      case 'Tab':
        if (e.shiftKey) {
          moveToPreviousWord()
        } else {
          moveToNextWord()
        }
        break

      case 'Enter':
      case ' ':
        // Toggle direction on Enter or Space
        if (activeClue) {
          const newDirection: 'across' | 'down' = activeClue.direction === 'across' ? 'down' : 'across'
          setDirection(newDirection)
          onCellSelect(row, col, newDirection)
        }
        break

      default:
        // Handle letter input (including lowercase)
        if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
          const newValue = e.key.toUpperCase()
          onUpdateProgress(row, col, newValue)

          if (activeClue) {
            const movement: Movement = (activeClue?.direction as 'across' | 'down') === 'across' 
              ? { rowDelta: 0, colDelta: 1 } 
              : { rowDelta: 1, colDelta: 0 }
            moveToNextCell(row, col, movement.rowDelta, movement.colDelta)
          }
        }
    }
  }

  useEffect(() => {
    if (!Array.isArray(userProgress) || userProgress.length !== GRID_SIZE) {
      console.error('Invalid userProgress format')
      return
    }

    let rawGrid: string[] = []
    
    try {
      // Handle different grid formats
      if (typeof puzzle.grid === 'string') {
        const parsed = JSON.parse(puzzle.grid)
        // If it's a 2D array, flatten it
        rawGrid = Array.isArray(parsed[0]) 
          ? parsed.flat() 
          : parsed
      } else if (Array.isArray(puzzle.grid)) {
        // If it's already an array, ensure it's flattened
        rawGrid = Array.isArray(puzzle.grid[0])
          ? (puzzle.grid as string[][]).flat()
          : puzzle.grid as string[]
      } else {
        console.error('Invalid grid format:', puzzle.grid)
        return
      }

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
    } catch (error) {
      console.error('Error parsing grid:', error)
    }
  }, [puzzle.grid])

  // Validate userProgress format
  useEffect(() => {
    if (!Array.isArray(userProgress) || userProgress.length !== GRID_SIZE ||
        !userProgress.every(row => Array.isArray(row) && row.length === GRID_SIZE)) {
      console.error('Invalid userProgress format')
      return
    }
  }, [userProgress])

  function isPartOfActiveClue(row: number, col: number): boolean {
    if (!activeClue) return false

    // For across clues
    if (activeClue.direction === 'across') {
      // Check if we're in the same row
      if (row !== activeClue.row) return false
      
      // Get the start and end columns of the word
      const startCol = activeClue.column
      const endCol = startCol + activeClue.answer.length - 1
      
      // Check if the current cell is within the word's range
      return col >= startCol && col <= endCol
    } 
    // For down clues
    else {
      // Check if we're in the same column
      if (col !== activeClue.column) return false
      
      // Get the start and end rows of the word
      const startRow = activeClue.row
      const endRow = startRow + activeClue.answer.length - 1
      
      // Check if the current cell is within the word's range
      return row >= startRow && row <= endRow
    }
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
                "aspect-square text-center cursor-pointer select-none"
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
                  inputMode="none"
                  maxLength={1}
                  value={userProgress[i][j] || ''}
                  onChange={handleCellInput}
                  onKeyDown={(e) => handleKeyDown(e, i, j)}
                  className="w-full h-full text-center text-base md:text-lg font-medium text-black bg-transparent focus:outline-none select-none"
                  style={{ caretColor: 'transparent' }}
                  ref={activeCell?.row === i && activeCell?.col === j ? (el) => el?.focus() : null}
                  aria-label={`Row ${i + 1}, Column ${j + 1}`}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
