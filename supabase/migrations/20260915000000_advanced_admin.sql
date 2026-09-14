-- Advanced moderation settings and time-limited candidate approvals.
alter table public.profiles add column if not exists approval_expires_at timestamptz;
alter table public.profiles add column if not exists rejection_reason text;

create table if not exists public.platform_settings (
  id boolean primary key default true check (id),
  candidate_approval_days integer not null default 10 check (candidate_approval_days between 1 and 90),
  max_active_listings integer not null default 5 check (max_active_listings between 1 and 50),
  applications_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id) values (true) on conflict (id) do nothing;
alter table public.platform_settings enable row level security;
revoke all on public.platform_settings from anon, authenticated;

update public.profiles
set approval_status = 'beklemede'
where role in ('stajyer', 'ogrenci') and approval_status is null;

create or replace function public.protect_profile_privileges()
returns trigger language plpgsql set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  if tg_op = 'INSERT' and auth.uid() is null and exists (select 1 from auth.users where id = new.id) then
    new.role = 'stajyer';
    new.approval_status = 'beklemede';
    new.approval_expires_at = null;
    new.rejection_reason = null;
    return new;
  end if;
  if auth.uid() is null or new.id <> auth.uid() then raise exception 'Yetkisiz profil işlemi'; end if;
  new.email = coalesce(auth.jwt() ->> 'email', new.email);
  if tg_op = 'INSERT' then
    new.approval_status = 'beklemede';
    new.approval_expires_at = null;
    new.rejection_reason = null;
  elsif new.role = 'isveren' and old.role <> 'isveren' then
    new.approval_status = 'beklemede';
    new.approval_expires_at = null;
    new.rejection_reason = null;
  elsif old.role = 'isveren' and old.approval_status = 'reddedildi' and new.role = 'isveren' then
    new.approval_status = 'beklemede';
    new.approval_expires_at = null;
    new.rejection_reason = null;
  else
    new.role = old.role;
    new.approval_status = old.approval_status;
    new.approval_expires_at = old.approval_expires_at;
    new.rejection_reason = old.rejection_reason;
  end if;
  return new;
end;
$$;

create or replace function public.validate_job_listing()
returns trigger language plpgsql set search_path = public as $$
declare employer public.profiles%rowtype;
declare listing_limit integer;
begin
  if auth.role() = 'service_role' then return new; end if;
  if auth.uid() is null or new.employer_id <> auth.uid() then raise exception 'Yetkisiz ilan işlemi'; end if;
  select * into employer from public.profiles where id = auth.uid();
  if employer.role <> 'isveren' or employer.approval_status <> 'onaylandi' then
    raise exception 'Yalnızca onaylı işletmeler ilan yayınlayabilir';
  end if;
  select max_active_listings into listing_limit from public.platform_settings where id = true;
  listing_limit := coalesce(listing_limit, 5);
  if tg_op = 'INSERT' and (
    select count(*) from public.job_listings where employer_id = auth.uid() and status = 'active'
  ) >= listing_limit then
    raise exception 'Aktif ilan limitine ulaştınız';
  end if;
  new.company_name = employer.company_name;
  return new;
end;
$$;

create or replace function public.validate_job_application()
returns trigger language plpgsql set search_path = public as $$
begin
  if auth.role() = 'service_role' then return new; end if;
  if tg_op = 'INSERT' then
    if not coalesce((select applications_enabled from public.platform_settings where id = true), true) then
      raise exception 'Başvurular geçici olarak kapalı';
    end if;
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

create or replace function public.get_public_platform_settings()
returns table (candidate_approval_days integer, max_active_listings integer, applications_enabled boolean)
language sql stable security definer set search_path = public as $$
  select s.candidate_approval_days, s.max_active_listings, s.applications_enabled
  from public.platform_settings s where s.id = true;
$$;

create or replace function public.list_public_candidates(limit_count integer default 100)
returns table (
  id uuid, full_name text, city text, location text, school text, grade text,
  department text, skills text, avatar_url text, internship_term text, created_at timestamptz
) language sql stable security definer set search_path = public as $$
  select p.id, p.full_name, p.city, p.location, p.school, p.grade, p.department,
         p.skills, p.avatar_url, p.internship_term, p.created_at
  from public.profiles p
  where p.role in ('stajyer', 'ogrenci')
    and p.is_looking_for_internship = true
    and p.approval_status = 'onaylandi'
    and p.approval_expires_at > now()
  order by p.created_at desc
  limit greatest(1, least(coalesce(limit_count, 100), 100));
$$;

create or replace function public.send_internship_offer(target_candidate uuid, offer_message text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare offer_id uuid;
begin
  if not exists (
    select 1 from public.profiles where id=auth.uid() and role='isveren' and approval_status='onaylandi'
  ) then raise exception 'Onaylı işletme hesabı gerekli'; end if;
  if not exists (
    select 1 from public.profiles where id=target_candidate and role in ('stajyer','ogrenci')
      and is_looking_for_internship=true and approval_status='onaylandi' and approval_expires_at > now()
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

revoke all on function public.get_public_platform_settings() from public;
grant execute on function public.get_public_platform_settings() to anon, authenticated;

create index if not exists profiles_approval_expiry_idx
  on public.profiles (approval_expires_at) where approval_status = 'onaylandi';
