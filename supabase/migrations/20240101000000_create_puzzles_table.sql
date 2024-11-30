-- Enable necessary extensions
create extension if not exists "pg_trgm";

-- Create puzzles table
create table if not exists public.puzzles (
    id uuid default gen_random_uuid() primary key,
    title text,
    grid jsonb not null,
    clues jsonb not null,
    author text not null,
    editor text,
    date date not null,
    difficulty text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.puzzles enable row level security;

-- Create policy to allow anyone to read puzzles
create policy "Puzzles are viewable by everyone"
    on public.puzzles for select
    using (true);

-- Add indexes
create index if not exists puzzles_date_idx on public.puzzles(date);
create index if not exists puzzles_author_idx on public.puzzles using gin (author gin_trgm_ops); 