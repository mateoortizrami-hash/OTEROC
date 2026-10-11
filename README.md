# Inversiones OTEROC: sitio web y portal de certificados

Sitio corporativo (inicio, políticas y contacto) con un **portal del cliente** para descargar certificados en PDF. El admin sube los certificados a un **inventario único**. Cualquier persona crea su cuenta con correo y contraseña; cuando el admin la **aprueba**, puede ver todo el inventario y descargar los certificados que necesite. **La app no envía correos**, así que no necesita servidor de correo.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres y Storage) · Vercel.

## Cómo funciona

| Rol | Acceso | Puede |
|---|---|---|
| Visitante | Público | Ver inicio, políticas y contacto |
| Cliente | `/portal/registro` para crear cuenta y `/portal` para ingresar, con correo y contraseña | Ya aprobado: ver, buscar y descargar todos los certificados |
| Admin | `/portal` (el mismo login; el sistema lo lleva a `/admin`), con correo y contraseña | Cargar y eliminar certificados, aprobar o revocar cuentas, restablecer contraseñas, eliminar cuentas |

- **Registro libre, sin correos:** la cuenta queda creada al instante y la app no envía correos. Una cuenta nueva queda **pendiente** y no ve ningún certificado.
- **Aprobación:** el panel del admin muestra las cuentas pendientes. Antes de aprobar, el admin confirma (por teléfono o WhatsApp) que es un cliente real, porque una cuenta aprobada ve **todo** el inventario. El acceso se puede revocar en cualquier momento.
- **Contraseña olvidada:** el cliente escribe a la empresa y el admin le asigna una nueva desde su ficha.
- **Admin único:** se define por SQL con `role = 'admin'`. Ningún usuario puede cambiar su propio rol desde la app.
- **Los PDFs están en un bucket privado:**
  - Los nombres de archivo son UUID aleatorios.
  - Para entregar un certificado, `/api/certificados/[id]` valida la sesión y que la cuenta esté aprobada (RLS), y redirige a una URL firmada que expira en 60 segundos.
- **Defensa en profundidad:** aunque falle el frontend, las políticas RLS de Postgres y de Storage impiden que una cuenta no aprobada vea o descargue certificados.
- **SEO:** se indexan `/`, `/politicas` y `/contacto`. `/portal`, `/admin` y `/api` llevan `noindex` (meta tag y cabecera `X-Robots-Tag`).

## Estructura

```
src/
  proxy.ts                    # refresca la sesión y redirige al login (chequeo optimista)
  lib/
    site.ts                   # contenido de la empresa: misión, visión, políticas, contacto
    auth.ts                   # getCurrentProfile / requireAdmin / requireClient
    supabase/                 # clientes: server, browser, admin (secret key) y proxy
  app/
    (site)/                   # páginas públicas + portal del cliente (comparten header/footer)
    admin/                    # login y panel de administración
    actions/                  # server actions (auth y admin)
    api/certificados/[id]/    # entrega segura de PDFs
supabase/
  migrations/                 # 0001: base · 0002: registro libre · 0003: inventario compartido + aprobación
  seed_admin.sql              # asigna el rol admin
```

## Puesta en marcha

### 1. Supabase (plan gratuito)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** y ejecuta, en orden, `0001_init.sql`, `0002_registro_libre.sql` y `0003_inventario_compartido.sql` (carpeta `supabase/migrations/`).
3. Ve a **Authentication → Sign In / Providers**:
   - Deja **activado** "Allow new users to sign up".
   - En **Email**, desactiva **"Confirm email"**. Es obligatorio: sin esto, el registro intentaría enviar un correo de verificación.
   - Si aparece la opción, sube **Minimum password length** a 8.
4. Crea el administrador:
   1. En **Authentication → Users → Add user → Create new user**, usa su correo y una contraseña fuerte, y marca **Auto Confirm User**.
   2. Edita `supabase/seed_admin.sql` con ese correo y ejecútalo en el SQL Editor.
5. En **Project Settings → API Keys**, copia la URL, la *publishable key* y la *secret key*.

> **Pausa por inactividad:** el plan gratuito de Supabase pausa el proyecto tras 7 días sin actividad. Para evitarlo, `vercel.json` programa una tarea diaria (Vercel Cron, 8:00 a. m. hora Colombia) que llama a `/api/keep-alive` y hace una consulta mínima. Configura `CRON_SECRET` en Vercel para que solo Vercel pueda llamarla. Si aun así se pausa, se reactiva desde el panel de Supabase.

### 2. Local

```bash
cp .env.example .env.local   # completa las variables
npm install
npm run dev                  # http://localhost:3000
```

### 3. Vercel

1. Sube el repositorio a GitHub e impórtalo en Vercel.
2. Configura las variables de `.env.example` en **Settings → Environment Variables**, incluida `CRON_SECRET` (un texto aleatorio largo). `NEXT_PUBLIC_SITE_URL` debe ser el dominio final.

## Seguridad: puntos clave

- `SUPABASE_SECRET_KEY` solo se usa en el servidor (`server-only`), y únicamente después de `requireAdmin()`, para eliminar usuarios o cambiar su contraseña en Auth.
- **Validación de PDFs:**
  - En el navegador: tamaño máximo de 10 MB y firma `%PDF-`.
  - En el bucket: `allowed_mime_types` y `file_size_limit`.
- **Login:** el mensaje de error es el mismo si el correo no existe o si la contraseña es incorrecta. Supabase limita por IP los intentos de registro e inicio de sesión.
- **Roles:** toda cuenta nueva nace como `client`, aunque alguien manipule los datos del registro; el rol `admin` solo se asigna por SQL.
- **Contraseñas:** mínimo 8 caracteres. Supabase las guarda cifradas (bcrypt); nadie puede verlas, ni siquiera el admin.
