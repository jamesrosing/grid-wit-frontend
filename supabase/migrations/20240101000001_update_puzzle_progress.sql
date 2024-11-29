-- Add puzzle_data column to puzzle_progress table
ALTER TABLE public.puzzle_progress
ADD COLUMN IF NOT EXISTS puzzle_data jsonb;

-- Update existing rows to include puzzle data
UPDATE public.puzzle_progress pp
SET puzzle_data = jsonb_build_object(
  'title', p.title,
  'author', p.author,
  'date', p.date
)
FROM public.puzzles p
WHERE pp.puzzle_id = p.id::text; 