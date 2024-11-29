-- Add foreign key relationship between puzzle_progress and puzzles
ALTER TABLE public.puzzle_progress
ADD CONSTRAINT puzzle_progress_puzzle_id_fkey
FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id)
ON DELETE CASCADE; 