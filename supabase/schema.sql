-- Run this in your Supabase project's SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT throughout.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('digital','image')),
  message text,
  image_path text,
  author text,
  is_anon boolean not null default false,
  color text not null default 'bubble',
  edit_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent column adds for projects created before edit support.
alter table public.notes add column if not exists edit_token uuid not null default gen_random_uuid();
alter table public.notes add column if not exists updated_at timestamptz not null default now();

create index if not exists notes_created_at_idx on public.notes (created_at desc);

alter table public.notes enable row level security;

drop policy if exists "anyone can read notes" on public.notes;
create policy "anyone can read notes" on public.notes
  for select using (true);

-- Inserts / updates / deletes go through the server route using the service
-- role key, so no policy is needed for the anon key beyond read.

-- Public storage bucket for uploaded images.
insert into storage.buckets (id, name, public)
values ('notes', 'notes', true)
on conflict (id) do nothing;
