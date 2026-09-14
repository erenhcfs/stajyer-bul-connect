-- Core platform schema and security rules for profiles, listings and applications.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'stajyer',
  approval_status text,
  full_name text,
  email text,
  phone text,
  city text,
  location text,
  school text,
  grade text,
  department text,
  age integer,
  skills text,
  avatar_url text,
  internship_term text,
  company_name text,
  tax_number text,
  sector text,
  logo_url text,
  banner_url text,
  about text,
  is_looking_for_internship boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'stajyer';
alter table public.profiles add column if not exists approval_status text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists location text;
alter table public.profiles add column if not exists school text;
alter table public.profiles add column if not exists grade text;
alter table public.profiles add column if not exists department text;
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists skills text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists internship_term text;
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists tax_number text;
alter table public.profiles add column if not exists sector text;
alter table public.profiles add column if not exists logo_url text;
alter table public.profiles add column if not exists banner_url text;
alter table public.profiles add column if not exists about text;
alter table public.profiles add column if not exists is_looking_for_internship boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.job_listings (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  company_name text not null,
  location text not null,
  work_type text not null,
  department text not null,
  description text not null,
  requirements text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_listings add column if not exists status text not null default 'active';
alter table public.job_listings add column if not exists updated_at timestamptz not null default now();

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.job_listings(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, candidate_id)
);

create table if not exists public.internship_offers (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('stajyer', 'ogrenci', 'isveren'));
alter table public.profiles drop constraint if exists profiles_approval_status_check;
alter table public.profiles add constraint profiles_approval_status_check
  check (approval_status is null or approval_status in ('beklemede', 'onaylandi', 'reddedildi'));
alter table public.profiles drop constraint if exists profiles_age_check;
alter table public.profiles add constraint profiles_age_check check (age is null or age between 14 and 99);
alter table public.job_listings drop constraint if exists job_listings_status_check;
alter table public.job_listings add constraint job_listings_status_check check (status in ('active', 'closed'));
alter table public.job_applications drop constraint if exists job_applications_status_check;
alter table public.job_applications add constraint job_applications_status_check
  check (status in ('pending', 'reviewing', 'accepted', 'rejected'));
alter table public.internship_offers drop constraint if exists internship_offers_status_check;
alter table public.internship_offers add constraint internship_offers_status_check
  check (status in ('pending', 'accepted', 'rejected'));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists job_listings_updated_at on public.job_listings;
create trigger job_listings_updated_at before update on public.job_listings
for each row execute function public.set_updated_at();
drop trigger if exists job_applications_updated_at on public.job_applications;
create trigger job_applications_updated_at before update on public.job_applications
for each row execute function public.set_updated_at();
drop trigger if exists internship_offers_updated_at on public.internship_offers;
create trigger internship_offers_updated_at before update on public.internship_offers
for each row execute function public.set_updated_at();

create or replace function public.protect_offer_update()
returns trigger language plpgsql set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  new.employer_id = old.employer_id;
  new.candidate_id = old.candidate_id;
  new.message = old.message;
  new.status = case when new.status in ('accepted','rejected') then new.status else old.status end;
  return new;
end;
$$;
drop trigger if exists protect_offer_update on public.internship_offers;
create trigger protect_offer_update before update on public.internship_offers
for each row execute function public.protect_offer_update();

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'stajyer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create or replace function public.protect_profile_privileges()
returns trigger language plpgsql set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  if auth.uid() is null or new.id <> auth.uid() then raise exception 'Yetkisiz profil işlemi'; end if;

  new.email = coalesce(auth.jwt() ->> 'email', new.email);
  if tg_op = 'UPDATE' and old.approval_status = 'onaylandi' then
    new.role = old.role;
    new.approval_status = old.approval_status;
  elsif new.role = 'isveren' then
    new.approval_status = 'beklemede';
  else
    new.approval_status = null;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges before insert or update on public.profiles
for each row execute function public.protect_profile_privileges();

create or replace function public.validate_job_listing()
returns trigger language plpgsql set search_path = public as $$
declare employer public.profiles%rowtype;
begin
  if auth.role() = 'service_role' then return new; end if;
  if auth.uid() is null or new.employer_id <> auth.uid() then raise exception 'Yetkisiz ilan işlemi'; end if;
  select * into employer from public.profiles where id = auth.uid();
  if employer.role <> 'isveren' or employer.approval_status <> 'onaylandi' then
    raise exception 'Yalnızca onaylı işletmeler ilan yayınlayabilir';
  end if;
  if tg_op = 'INSERT' and (select count(*) from public.job_listings where employer_id = auth.uid()) >= 5 then
    raise exception 'En fazla 5 ilan yayınlayabilirsiniz';
  end if;
  new.company_name = employer.company_name;
  return new;
end;
$$;

drop trigger if exists validate_job_listing on public.job_listings;
create trigger validate_job_listing before insert or update on public.job_listings
for each row execute function public.validate_job_listing();

create or replace function public.validate_job_application()
returns trigger language plpgsql set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  if tg_op = 'INSERT' then
    if auth.uid() is null or new.candidate_id <> auth.uid() then raise exception 'Yetkisiz başvuru'; end if;
    if not exists (select 1 from public.profiles where id=auth.uid() and role in ('stajyer','ogrenci')) then
      raise exception 'Yalnızca öğrenci profilleri başvurabilir';
    end if;
    if not exists (select 1 from public.job_listings where id=new.listing_id and status='active') then
      raise exception 'İlan başvuruya açık değil';
    end if;
    new.status = 'pending';
  else
    new.listing_id = old.listing_id;
    new.candidate_id = old.candidate_id;
    new.cover_letter = old.cover_letter;
  end if;
  if length(coalesce(new.cover_letter,'')) > 1000 then raise exception 'Ön yazı çok uzun'; end if;
  return new;
end;
$$;
drop trigger if exists validate_job_application on public.job_applications;
create trigger validate_job_application before insert or update on public.job_applications
for each row execute function public.validate_job_application();

alter table public.profiles enable row level security;
alter table public.job_listings enable row level security;
alter table public.job_applications enable row level security;
alter table public.internship_offers enable row level security;

do $$ declare policy_name text; table_var text;
begin
  foreach table_var in array array['profiles','job_listings','job_applications','internship_offers'] loop
    for policy_name in select p.policyname from pg_policies p where p.schemaname='public' and p.tablename=table_var loop
      execute format('drop policy %I on public.%I', policy_name, table_var);
    end loop;
  end loop;
end $$;

create policy profiles_read_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_insert_own on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy listings_public_read on public.job_listings for select using (status = 'active' or employer_id = auth.uid());
create policy listings_insert_own on public.job_listings for insert to authenticated with check (employer_id = auth.uid());
create policy listings_update_own on public.job_listings for update to authenticated
using (employer_id = auth.uid()) with check (employer_id = auth.uid());
create policy listings_delete_own on public.job_listings for delete to authenticated using (employer_id = auth.uid());

create policy applications_insert_own on public.job_applications for insert to authenticated
with check (candidate_id = auth.uid());
create policy applications_read_parties on public.job_applications for select to authenticated
using (
  candidate_id = auth.uid() or exists (
    select 1 from public.job_listings l where l.id = listing_id and l.employer_id = auth.uid()
  )
);
create policy applications_update_employer on public.job_applications for update to authenticated
using (exists (select 1 from public.job_listings l where l.id = listing_id and l.employer_id = auth.uid()))
with check (exists (select 1 from public.job_listings l where l.id = listing_id and l.employer_id = auth.uid()));
create policy applications_delete_candidate on public.job_applications for delete to authenticated
using (candidate_id = auth.uid() and status = 'pending');

create policy offers_read_parties on public.internship_offers for select to authenticated
using (employer_id = auth.uid() or candidate_id = auth.uid());
create policy offers_update_candidate on public.internship_offers for update to authenticated
using (candidate_id = auth.uid()) with check (candidate_id = auth.uid());

create or replace function public.list_public_candidates(limit_count integer default 100)
returns table (
  id uuid, full_name text, city text, location text, school text, grade text,
  department text, skills text, avatar_url text, internship_term text, created_at timestamptz
) language sql stable security definer set search_path = public as $$
  select p.id, p.full_name, p.city, p.location, p.school, p.grade, p.department,
         p.skills, p.avatar_url, p.internship_term, p.created_at
  from public.profiles p
  where p.role in ('stajyer', 'ogrenci') and p.is_looking_for_internship = true
  order by p.created_at desc
  limit greatest(1, least(coalesce(limit_count, 100), 100));
$$;

create or replace function public.get_employer_applications()
returns table (
  id uuid, listing_id uuid, listing_title text, candidate_id uuid, candidate_name text,
  candidate_email text, candidate_phone text, candidate_school text, candidate_department text,
  candidate_skills text, status text, cover_letter text, created_at timestamptz
) language sql stable security definer set search_path = public as $$
  select a.id, a.listing_id, l.title, a.candidate_id, p.full_name, p.email, p.phone,
         p.school, p.department, p.skills, a.status, a.cover_letter, a.created_at
  from public.job_applications a
  join public.job_listings l on l.id = a.listing_id
  join public.profiles p on p.id = a.candidate_id
  where l.employer_id = auth.uid()
  order by a.created_at desc;
$$;

create or replace function public.send_internship_offer(target_candidate uuid, offer_message text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare offer_id uuid;
begin
  if not exists (
    select 1 from public.profiles where id=auth.uid() and role='isveren' and approval_status='onaylandi'
  ) then raise exception 'Onaylı işletme hesabı gerekli'; end if;
  if not exists (
    select 1 from public.profiles where id=target_candidate and role in ('stajyer','ogrenci') and is_looking_for_internship=true
  ) then raise exception 'Aday artık teklif kabul etmiyor'; end if;
  if length(coalesce(offer_message,'')) > 1000 then raise exception 'Mesaj çok uzun'; end if;
  insert into public.internship_offers (employer_id, candidate_id, message)
  values (auth.uid(), target_candidate, nullif(trim(offer_message), ''))
  on conflict (employer_id, candidate_id) do update
    set message=excluded.message, status='pending', updated_at=now()
  returning id into offer_id;
  return offer_id;
end;
$$;

create or replace function public.get_my_offers()
returns table (
  id uuid, employer_id uuid, company_name text, employer_email text, employer_phone text,
  message text, status text, created_at timestamptz
) language sql stable security definer set search_path = public as $$
  select o.id, o.employer_id, p.company_name, p.email, p.phone, o.message, o.status, o.created_at
  from public.internship_offers o
  join public.profiles p on p.id = o.employer_id
  where o.candidate_id = auth.uid()
  order by o.created_at desc;
$$;

revoke all on function public.list_public_candidates(integer) from public;
revoke all on function public.get_employer_applications() from public;
revoke all on function public.send_internship_offer(uuid, text) from public;
revoke all on function public.get_my_offers() from public;
grant execute on function public.list_public_candidates(integer) to anon, authenticated;
grant execute on function public.get_employer_applications() to authenticated;
grant execute on function public.send_internship_offer(uuid, text) to authenticated;
grant execute on function public.get_my_offers() to authenticated;

create index if not exists profiles_candidate_search_idx
  on public.profiles (created_at desc) where is_looking_for_internship = true;
create index if not exists job_listings_employer_idx on public.job_listings (employer_id, created_at desc);
create index if not exists job_applications_listing_idx on public.job_applications (listing_id, created_at desc);
create index if not exists job_applications_candidate_idx on public.job_applications (candidate_id, created_at desc);
create index if not exists internship_offers_candidate_idx on public.internship_offers (candidate_id, created_at desc);
create unique index if not exists internship_offers_pair_idx on public.internship_offers (employer_id, candidate_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects for update to authenticated
using (bucket_id = 'avatars' and owner_id = auth.uid()::text)
with check (bucket_id = 'avatars' and owner_id = auth.uid()::text);
drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and owner_id = auth.uid()::text);
