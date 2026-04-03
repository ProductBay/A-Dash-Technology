create extension if not exists pgcrypto;

alter table public.service_requests
  add column if not exists customer_id uuid references auth.users(id) on delete set null;

create index if not exists idx_service_requests_customer_id
  on public.service_requests (customer_id);

drop policy if exists "service_requests_public_insert" on public.service_requests;
create policy "service_requests_public_insert"
on public.service_requests
for insert
to anon, authenticated
with check (customer_id is null or auth.uid() = customer_id);

drop policy if exists "service_requests_customer_select" on public.service_requests;
create policy "service_requests_customer_select"
on public.service_requests
for select
to authenticated
using (auth.uid() = customer_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text,
  full_name text,
  company text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  metadata jsonb not null default '{}'::jsonb
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    company,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'company',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    company = coalesce(public.profiles.company, excluded.company),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

create table if not exists public.customer_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  service_request_id bigint references public.service_requests(id) on delete set null,
  project_code text unique,
  title text not null,
  summary text,
  status text not null default 'intake'
    check (status in ('intake', 'discovery', 'proposal', 'scheduled', 'in_progress', 'review', 'launched', 'support')),
  progress integer not null default 5 check (progress between 0 and 100),
  current_phase text,
  priority text not null default 'standard'
    check (priority in ('standard', 'priority', 'enterprise')),
  health text not null default 'on_track'
    check (health in ('on_track', 'watch', 'blocked')),
  start_date date,
  target_launch_date date,
  contract_value numeric(12, 2),
  currency text not null default 'JMD' check (currency in ('JMD', 'USD')),
  next_action text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_customer_projects_customer_id
  on public.customer_projects (customer_id, updated_at desc);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.customer_projects(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done')),
  sort_order integer not null default 0,
  due_date date,
  completed_at timestamptz
);

create index if not exists idx_project_milestones_customer_id
  on public.project_milestones (customer_id, project_id, sort_order);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references public.customer_projects(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'note'
    check (kind in ('note', 'milestone', 'deliverable', 'meeting', 'billing')),
  title text not null,
  body text not null,
  is_customer_visible boolean not null default true,
  event_date timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_project_updates_customer_id
  on public.project_updates (customer_id, project_id, created_at desc);

create or replace function public.set_record_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.sync_project_child_customer_id()
returns trigger
language plpgsql
as $$
begin
  select customer_id
  into new.customer_id
  from public.customer_projects
  where id = new.project_id;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_record_updated_at();

drop trigger if exists customer_projects_set_updated_at on public.customer_projects;
create trigger customer_projects_set_updated_at
before update on public.customer_projects
for each row
execute function public.set_record_updated_at();

drop trigger if exists project_milestones_set_updated_at on public.project_milestones;
create trigger project_milestones_set_updated_at
before update on public.project_milestones
for each row
execute function public.set_record_updated_at();

drop trigger if exists project_updates_set_updated_at on public.project_updates;
create trigger project_updates_set_updated_at
before update on public.project_updates
for each row
execute function public.set_record_updated_at();

drop trigger if exists project_milestones_sync_customer_id on public.project_milestones;
create trigger project_milestones_sync_customer_id
before insert or update of project_id on public.project_milestones
for each row
execute function public.sync_project_child_customer_id();

drop trigger if exists project_updates_sync_customer_id on public.project_updates;
create trigger project_updates_sync_customer_id
before insert or update of project_id on public.project_updates
for each row
execute function public.sync_project_child_customer_id();

alter table public.profiles enable row level security;
alter table public.customer_projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_updates enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
on public.profiles
for select
to authenticated
using (auth.uid() = id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
on public.profiles
for update
to authenticated
using (auth.uid() = id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check (auth.uid() = id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "customer_projects_owner_select" on public.customer_projects;
create policy "customer_projects_owner_select"
on public.customer_projects
for select
to authenticated
using (auth.uid() = customer_id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "customer_projects_admin_write" on public.customer_projects;
create policy "customer_projects_admin_write"
on public.customer_projects
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "project_milestones_owner_select" on public.project_milestones;
create policy "project_milestones_owner_select"
on public.project_milestones
for select
to authenticated
using (auth.uid() = customer_id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "project_milestones_admin_write" on public.project_milestones;
create policy "project_milestones_admin_write"
on public.project_milestones
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "project_updates_owner_select" on public.project_updates;
create policy "project_updates_owner_select"
on public.project_updates
for select
to authenticated
using (
  ((auth.uid() = customer_id) and is_customer_visible = true)
  or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "project_updates_admin_write" on public.project_updates;
create policy "project_updates_admin_write"
on public.project_updates
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
