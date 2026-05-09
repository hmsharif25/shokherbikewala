-- site_config: generic key-value table for persisting admin settings (e.g. home section toggles).
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/pfegrhsefyqqjzmbgurs/sql/new

create table if not exists site_config (
  key  text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Allow public read so the storefront can load settings without auth.
alter table site_config enable row level security;

create policy "Anyone can read site_config"
  on site_config for select
  using (true);

-- Allow authenticated users (admin) to insert/update.
create policy "Authenticated users can upsert site_config"
  on site_config for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update site_config"
  on site_config for update
  using (auth.role() = 'authenticated');

-- Seed the home_sections row with defaults so the first load works.
insert into site_config (key, value)
values (
  'home_sections',
  '{
    "hero":             { "visible": true, "heading": "SHOKHER BIKEWALA",      "subheading": "" },
    "categories":       { "visible": true, "heading": "GEAR UP. RIDE BETTER.", "subheading": "Premium categories curated for riders who demand the best." },
    "featuredProducts": { "visible": true, "heading": "FEATURED PRODUCTS",     "subheading": "Handpicked high-performance gear for riders who demand the best." },
    "brandStory":       { "visible": true, "heading": "ENGINEERED FOR RIDERS", "subheading": "Every product is built for real-world performance." },
    "promoBanner":      { "visible": true, "heading": "PREMIUM RIDING GEAR",   "subheading": "UP TO 40% OFF" },
    "community":        { "visible": true, "heading": "RIDER SOCIAL FEED",     "subheading": "Follow us across platforms — join the fastest-growing rider community." },
    "testimonials":     { "visible": true, "heading": "WHAT RIDERS SAY",       "subheading": "Real stories from the Shokher Bikewala community." },
    "faq":              { "visible": true, "heading": "FREQUENTLY ASKED",      "subheading": "Everything you need to know before you ride." }
  }'::jsonb
)
on conflict (key) do nothing;
