-- Run this in your Supabase SQL editor

create table if not exists meals (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  name text not null,
  cal integer default 0,
  pro integer default 0,
  carb integer default 0,
  fat integer default 0,
  water integer default 0,
  created_at timestamp with time zone default now()
);

create table if not exists checklist (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  item_id text not null,
  done boolean default false,
  unique(date, item_id)
);

create table if not exists workout_log (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  exercise_index integer not null,
  done boolean default false,
  unique(date, exercise_index)
);

create table if not exists weight_log (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  weight numeric(5,1) not null,
  bf numeric(4,1),
  created_at timestamp with time zone default now()
);

create table if not exists user_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamp with time zone default now()
);

-- Enable RLS but allow all for now (single user app)
alter table meals enable row level security;
alter table checklist enable row level security;
alter table workout_log enable row level security;
alter table weight_log enable row level security;
alter table user_settings enable row level security;

create policy "Allow all" on meals for all using (true) with check (true);
create policy "Allow all" on checklist for all using (true) with check (true);
create policy "Allow all" on workout_log for all using (true) with check (true);
create policy "Allow all" on weight_log for all using (true) with check (true);
create policy "Allow all" on user_settings for all using (true) with check (true);