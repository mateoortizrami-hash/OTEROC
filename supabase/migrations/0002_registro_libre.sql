-- Registro libre: cualquier persona crea su cuenta desde /portal/registro.
-- El nombre/empresa llega en user_metadata (lo controla el usuario), así que se limita su largo.
-- El rol sigue naciendo siempre como 'client'.
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
    left(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 120)
  );
  return new;
end;
$$;
