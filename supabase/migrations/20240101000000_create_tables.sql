-- Create puzzle_progress table
create table if not exists public.puzzle_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    puzzle_id text not null,
    progress jsonb not null default '[]',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, puzzle_id)
);

-- Enable RLS on puzzle_progress
alter table public.puzzle_progress enable row level security;

-- Create puzzle_progress policies
create policy "Users can view their own puzzle progress"
    on public.puzzle_progress
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own puzzle progress"
    on public.puzzle_progress
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own puzzle progress"
    on public.puzzle_progress
    for update
    using (auth.uid() = user_id);

-- Create puzzle_bookmarks table
create table if not exists public.puzzle_bookmarks (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    puzzle_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, puzzle_id)
);

-- Enable RLS on puzzle_bookmarks
alter table public.puzzle_bookmarks enable row level security;

-- Create puzzle_bookmarks policies
create policy "Users can view their own bookmarks"
    on public.puzzle_bookmarks
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
    on public.puzzle_bookmarks
    for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
    on public.puzzle_bookmarks
    for delete
    using (auth.uid() = user_id);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger for puzzle_progress
create trigger handle_updated_at
    before update on public.puzzle_progress
    for each row
    execute function public.handle_updated_at();
