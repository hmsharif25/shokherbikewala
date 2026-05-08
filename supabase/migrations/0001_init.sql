-- Shokher Bike Wala — initial schema
-- Run in the Supabase SQL editor for project pfegrhsefyqqjzmbgurs.
--
-- Tables: categories, products, brand_settings, testimonials, inquiries
-- Auth model: anyone can read public catalog tables, anyone can submit
-- inquiries, only admins (matched against admin_emails view) can mutate.

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(u.email) in (
        'hmsharif2002@gmail.com',
        'admin@shokherbikewala.com'
      )
  );
$$;

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text default '',
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10,2) not null default 0,
  discount_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  images text[] not null default '{}',
  featured boolean not null default false,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_select_all" on public.products;
create policy "products_select_all" on public.products
  for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- brand_settings ----------
create table if not exists public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'Shokher Bike Wala',
  tagline text default '',
  logo_url text default '',
  hero_image_url text default '',
  whatsapp text default 'https://wa.me/8801518934708',
  facebook text default '',
  tiktok text default '',
  instagram text default '',
  updated_at timestamptz not null default now()
);

alter table public.brand_settings enable row level security;

drop policy if exists "brand_select_all" on public.brand_settings;
create policy "brand_select_all" on public.brand_settings
  for select using (true);

drop policy if exists "brand_admin_write" on public.brand_settings;
create policy "brand_admin_write" on public.brand_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id bigserial primary key,
  name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  product text default '',
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_select_all" on public.testimonials;
create policy "testimonials_select_all" on public.testimonials
  for select using (true);

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- inquiries ----------
create table if not exists public.inquiries (
  id bigserial primary key,
  customer_name text not null,
  phone text not null,
  product_name text default '',
  message text default '',
  status text not null default 'new' check (status in ('new','contacted','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "inquiries_admin_select" on public.inquiries;
create policy "inquiries_admin_select" on public.inquiries
  for select using (public.is_admin());

drop policy if exists "inquiries_anon_insert" on public.inquiries;
create policy "inquiries_anon_insert" on public.inquiries
  for insert with check (true);

drop policy if exists "inquiries_admin_update" on public.inquiries;
create policy "inquiries_admin_update" on public.inquiries
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "inquiries_admin_delete" on public.inquiries;
create policy "inquiries_admin_delete" on public.inquiries
  for delete using (public.is_admin());

-- ---------- seed default brand settings ----------
insert into public.brand_settings (brand_name, tagline, whatsapp, facebook, tiktok, instagram)
select
  'Shokher Bike Wala',
  'Your Ultimate Bike Accessories Destination',
  'https://wa.me/8801518934708',
  'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
  'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
  'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA=='
where not exists (select 1 from public.brand_settings);
