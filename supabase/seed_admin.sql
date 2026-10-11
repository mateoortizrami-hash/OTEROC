-- Ejecutar DESPUÉS de crear el usuario admin en
-- Supabase → Authentication → Users → "Add user" (con contraseña y "Auto Confirm User").
-- Reemplaza el correo por el del administrador.

update public.profiles
set role = 'admin'
where email = lower('admin@tu-dominio.com');
