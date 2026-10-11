-- =============================================================
-- Inventario compartido + aprobación de cuentas
-- - Los certificados ya no pertenecen a un cliente: forman un inventario único.
-- - Cualquier persona se registra, pero solo ve el inventario cuando el admin aprueba su cuenta.
-- Ejecutar completo en Supabase → SQL Editor (una sola vez), después de 0001 y 0002.
-- =============================================================

-- ---------- Aprobación de cuentas ----------
alter table public.profiles
  add column approved boolean not null default false;

update public.profiles set approved = true where role = 'admin';

-- true si quien consulta es admin o una cuenta aprobada.
create or replace function public.is_approved()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and (approved or role = 'admin')
  );
$$;

revoke execute on function public.is_approved() from public, anon;
grant execute on function public.is_approved() to authenticated;

-- El admin puede aprobar o revocar cuentas. Solo la columna "approved" es editable:
-- el rol sigue sin poder cambiarse desde la app.
grant update (approved) on public.profiles to authenticated;

create policy "profiles: admin aprueba"
  on public.profiles for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------- Certificados sin dueño ----------
drop policy "certificates: ver propios o admin" on public.certificates;
drop policy "certificates bucket: cliente lee los suyos" on storage.objects;

alter table public.certificates drop column client_id;

create policy "certificates: ver si aprobado"
  on public.certificates for select to authenticated
  using ((select public.is_approved()));

create policy "certificates bucket: aprobados leen"
  on storage.objects for select to authenticated
  using (bucket_id = 'certificates' and (select public.is_approved()));
