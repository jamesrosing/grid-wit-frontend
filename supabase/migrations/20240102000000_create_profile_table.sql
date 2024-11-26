-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    username text unique,
    display_name text,
    avatar_url text,
    bio text,
    preferences jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create profiles policies
create policy "Public profiles are viewable by everyone"
    on public.profiles
    for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles
    for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles
    for update
    using (auth.uid() = id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to automatically update the updated_at column
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updating the updated_at column
create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.set_updated_at();
