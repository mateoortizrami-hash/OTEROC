-- =============================================================
-- Portal de certificados · Inversiones OTEROC
-- Ejecutar completo en Supabase → SQL Editor (una sola vez).
-- =============================================================

-- ---------- Tipos ----------
create type public.user_role as enum ('admin', 'client');

-- ---------- Tablas ----------
-- Un perfil por usuario de Supabase Auth. Lo crea el trigger de abajo.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text,
  role        public.user_role not null default 'client',
  created_at  timestamptz not null default now()
);

create table public.certificates (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 200),
  file_path    text not null unique,
  file_size    integer not null check (file_size > 0),
  uploaded_by  uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now()
);

create index certificates_client_id_idx on public.certificates (client_id);

-- ---------- Funciones ----------
-- security definer: consulta profiles sin pasar por RLS (evita recursión).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Crea el perfil cuando el admin registra un usuario en Auth.
-- El rol siempre nace como 'client'; el admin se asigna solo por SQL (seed).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), '')
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Permisos y RLS ----------
revoke all on public.profiles, public.certificates from anon;
grant select on public.profiles to authenticated;
grant select, insert, delete on public.certificates to authenticated;

alter table public.profiles enable row level security;
alter table public.certificates enable row level security;

-- Cada usuario ve su propio perfil; el admin ve todos.
-- No hay políticas de insert/update/delete: nadie puede cambiar su rol desde la app.
create policy "profiles: ver propio o admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- El cliente solo ve SUS certificados; el admin ve todos.
create policy "certificates: ver propios o admin"
  on public.certificates for select to authenticated
  using (client_id = (select auth.uid()) or (select public.is_admin()));

create policy "certificates: admin crea"
  on public.certificates for insert to authenticated
  with check ((select public.is_admin()));

create policy "certificates: admin elimina"
  on public.certificates for delete to authenticated
  using ((select public.is_admin()));

-- ---------- Storage ----------
-- Bucket PRIVADO: los PDFs solo se entregan con URLs firmadas de corta duración.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificates', 'certificates', false, 10485760, array['application/pdf']);

create policy "certificates bucket: admin gestiona"
  on storage.objects for all to authenticated
  using (bucket_id = 'certificates' and (select public.is_admin()))
  with check (bucket_id = 'certificates' and (select public.is_admin()));

create policy "certificates bucket: cliente lee los suyos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'certificates'
    and exists (
      select 1 from public.certificates c
      where c.file_path = storage.objects.name
        and c.client_id = (select auth.uid())
    )
  );
