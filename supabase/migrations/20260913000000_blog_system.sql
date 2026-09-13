create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  image_url text,
  author_name text not null default 'Stajyer Bul Ekibi',
  author_initials text not null default 'SB',
  published boolean not null default false,
  view_count bigint not null default 0 check (view_count >= 0),
  seo_title text,
  seo_description text,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts add column if not exists view_count bigint not null default 0;
alter table public.blog_posts add column if not exists seo_title text;
alter table public.blog_posts add column if not exists seo_description text;
alter table public.blog_posts add column if not exists keywords text[] not null default '{}';
alter table public.blog_posts add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_blog_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_blog_updated_at();

alter table public.blog_posts enable row level security;
drop policy if exists "Published blog posts are public" on public.blog_posts;
create policy "Published blog posts are public" on public.blog_posts
for select to anon, authenticated using (published = true);

revoke insert, update, delete on public.blog_posts from anon, authenticated;

create or replace function public.increment_blog_view(post_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare new_count bigint;
begin
  update public.blog_posts
  set view_count = view_count + 1
  where slug = post_slug and published = true
  returning view_count into new_count;
  return new_count;
end;
$$;

revoke all on function public.increment_blog_view(text) from public;
grant execute on function public.increment_blog_view(text) to anon, authenticated;

create index if not exists blog_posts_published_created_idx
on public.blog_posts (published, created_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category);
