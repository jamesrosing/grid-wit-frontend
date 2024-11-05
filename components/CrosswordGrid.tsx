'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { Puzzle, Cell, ActiveCell, GRID_SIZE } from '@/types'

interface Props {
  puzzle: Puzzle
  onCellSelect: (row: number, col: number, direction: 'across' | 'down') => void
  activeCell: ActiveCell | null
  userProgress: string[][]
  onUpdateProgress: (row: number, col: number, value: string) => void
}

export function CrosswordGrid({ 
  puzzle, 
  onCellSelect, 
  activeCell, 
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      // If current cell has value, clear it
      if (userProgress[row][col]) {
        onUpdateProgress(row, col, '')
      } else {
        // If current cell is empty, move to previous cell and clear it
        moveToPreviousCell()
        const prevCell = getPreviousCell(row, col)
        if (prevCell) {
          onUpdateProgress(prevCell.row, prevCell.col, '')
        }
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

  const handleCellInput = (row: number, col: number, value: string) => {
    if (grid[row][col].isBlack) return

    const newValue = value.toUpperCase().replace(/[^A-Z]/g, '')
    if (newValue) {
      onUpdateProgress(row, col, newValue)
      moveToNextCellInWord()
    }
  }

  const getPreviousCell = (row: number, col: number) => {
    if (direction === 'across') {
      return col > 0 && !grid[row][col-1].isBlack ? { row, col: col-1 } : null
    } else {
      return row > 0 && !grid[row-1][col].isBlack ? { row: row-1, col } : null
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
      onCellSelect(newRow, newCol, direction)
    }
  }

  const moveToNextCellInWord = () => {
    if (!activeCell) return

    const { row, col } = activeCell
    if (direction === 'across') {
      moveToNextCell(row, col, 0, 1)
    } else {
      moveToNextCell(row, col, 1, 0)
    }
  }

  const moveToPreviousCell = () => {
    if (!activeCell) return

    const { row, col } = activeCell
    if (direction === 'across') {
      moveToNextCell(row, col, 0, -1)
    } else {
      moveToNextCell(row, col, -1, 0)
    }
  }

  const moveToNextWord = () => {
    // Find next starting cell
    if (!activeCell) return

    const { row, col } = activeCell
    let found = false
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (found && !grid[i][j].isBlack && grid[i][j].isStart[direction]) {
          onCellSelect(i, j, direction)
          return
        }
        if (i === row && j === col) found = true
      }
    }
  }

  return (
    <div className="grid gap-px bg-gray-200 border border-gray-300" 
         style={{ 
           gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
           aspectRatio: '1/1',
           maxWidth: '600px'
         }}>
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`
              relative flex items-center justify-center
              ${cell.isBlack ? 'bg-black' : 'bg-white'}
              ${activeCell?.row === i && activeCell?.col === j ? 'bg-blue-100' : 'hover:bg-blue-50'}
              ${activeCell && isActiveLine(i, j) ? 'bg-blue-50' : ''}
              aspect-square text-center text-lg cursor-pointer
            `}
            onClick={() => {
              if (!cell.isBlack) {
                const newDirection = cell.isStart.across && cell.isStart.down
                  ? direction === 'across' ? 'down' : 'across'
                  : cell.isStart.down ? 'down' : 'across'
                setDirection(newDirection)
                onCellSelect(i, j, newDirection)
              }
            }}
          >
            {cell.number && (
              <span className="absolute top-0.5 left-0.5 text-[8px] font-normal text-black">
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
                className="w-full h-full text-center text-lg font-medium text-black bg-transparent focus:outline-none"
                style={{ caretColor: 'transparent' }}
                ref={activeCell?.row === i && activeCell?.col === j ? (el) => el?.focus() : null}
              />
            )}
          </div>
        ))
      )}
    </div>
  )
}

function isActiveLine(row: number, col: number, activeCell: ActiveCell | null, direction: 'across' | 'down'): boolean {
  if (!activeCell) return false
  if (direction === 'across') return row === activeCell.row
  return col === activeCell.col
}