-- =====================================================================
-- Storage bucket for image uploads from the admin panel
--
-- Creates a public bucket called `assets` and the RLS policies that let
-- authenticated admins upload / replace / delete files while anyone can
-- read them. Run this AFTER 0001_init.sql in the Supabase SQL editor.
-- =====================================================================

-- 1. Create the bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = excluded.public;

-- 2. Make sure RLS is on (it usually already is for storage.objects)
alter table storage.objects enable row level security;

-- 3. Drop any prior copies of our policies so re-running this migration
--    is safe.
drop policy if exists "assets read public" on storage.objects;
drop policy if exists "assets admin insert" on storage.objects;
drop policy if exists "assets admin update" on storage.objects;
drop policy if exists "assets admin delete" on storage.objects;

-- 4. Public read for anything in the assets bucket
create policy "assets read public"
  on storage.objects for select
  using (bucket_id = 'assets');

-- 5. Admin-only writes. Reuses the is_admin() helper from 0001_init.sql.
create policy "assets admin insert"
  on storage.objects for insert
  with check (bucket_id = 'assets' and public.is_admin());

create policy "assets admin update"
  on storage.objects for update
  using (bucket_id = 'assets' and public.is_admin())
  with check (bucket_id = 'assets' and public.is_admin());

create policy "assets admin delete"
  on storage.objects for delete
  using (bucket_id = 'assets' and public.is_admin());
