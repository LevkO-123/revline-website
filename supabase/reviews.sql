-- REVLINE website reviews: private until an owner changes status from pending to approved.
create extension if not exists pgcrypto;

create table if not exists public.revline_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null check (char_length(reviewer_name) between 2 and 80),
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 12 and 2000),
  vehicle_label text null check (vehicle_label is null or char_length(vehicle_label) <= 100),
  photo_path text null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz null
);

create index if not exists revline_reviews_public_feed
  on public.revline_reviews (created_at desc)
  where status = 'approved';

alter table public.revline_reviews enable row level security;
revoke all on public.revline_reviews from anon, authenticated;
-- No anonymous read, insert, update or delete policy is created.
-- The Vercel API uses SUPABASE_SERVICE_ROLE_KEY server-side and forces new rows to pending.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('revline-review-photos', 'revline-review-photos', false, 1048576, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 1048576, allowed_mime_types = excluded.allowed_mime_types;

-- Keep Storage private. Do not create anon/authenticated policies for this bucket.
-- To publish a submitted review, verify it and its photo in the dashboard:
-- update public.revline_reviews
-- set status = 'approved', approved_at = now()
-- where id = 'REVIEW-UUID' and status = 'pending';
-- To reject, set status = 'rejected'. Deleting a rejected photo is optional.
