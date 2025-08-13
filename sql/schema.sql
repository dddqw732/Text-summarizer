-- Create summaries table
create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  original_text text not null,
  summary text not null,
  tokens_used integer,
  model text,
  length_option text check (length_option in ('short','medium','long')),
  format_option text check (format_option in ('paragraph','bullets','tldr'))
);

alter table public.summaries enable row level security;

-- Policies: each user can manage their own summaries
create policy if not exists "Users can view own summaries"
on public.summaries for select
using (auth.uid() = user_id);

create policy if not exists "Users can insert own summaries"
on public.summaries for insert
with check (auth.uid() = user_id);

create policy if not exists "Users can delete own summaries"
on public.summaries for delete
using (auth.uid() = user_id);

