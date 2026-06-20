# AccountCamp — Documentación del proyecto

Plataforma de aprendizaje online construida con **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4** y **Supabase** (auth + base de datos).

---

## Tabla de contenidos

1. [Resumen](#resumen)
2. [Stack tecnológico](#stack-tecnológico)
3. [Inicio rápido](#inicio-rápido)
4. [Variables de entorno](#variables-de-entorno)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Rutas y áreas de la aplicación](#rutas-y-áreas-de-la-aplicación)
7. [Autenticación](#autenticación)
8. [Datos y Supabase](#datos-y-supabase)
9. [Componentes y UI](#componentes-y-ui)
10. [Convenciones del equipo](#convenciones-del-equipo)
11. [Scripts disponibles](#scripts-disponibles)
12. [Estado actual y pendientes](#estado-actual-y-pendientes)

---

## Resumen

**AccountCamp** es una plataforma educativa orientada a estudiantes, profesores y administradores. Actualmente incluye:

- **Landing pública** con enlaces a login y registro.
- **Flujo completo de autenticación** con Supabase (login, registro, verificación por correo, recuperación y restablecimiento de contraseña).
- **Área de estudiante** con shell (sidebar, header, navegación móvil) y dashboard placeholder.
- **Listado de rutas profesionales** conectado a Supabase (`/student/routes`).
- **Esqueletos** para áreas de profesor (`/teacher`) y administrador (`/admin`).

Los roles previstos son: `admin`, `teacher` y `student`.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (estilo *new-york*) |
| Formularios | react-hook-form + Zod |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Backend / Auth / DB | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Lenguaje | TypeScript 5 |
| Lint | ESLint 9 + eslint-config-next |

---

## Inicio rápido

### Requisitos

- Node.js 20+
- npm
- Proyecto Supabase configurado

### Instalación y desarrollo

```bash
# Clonar e instalar dependencias
npm install

# Configurar variables de entorno (ver sección siguiente)
cp .env.example .env.local

# Servidor de desarrollo (http://localhost:3000)
npm run dev
```

### Build de producción

```bash
npm run build
npm run start
```

---

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase |
| `NEXT_PUBLIC_SITE_URL` | URL base para redirects de auth (ej. `http://localhost:3000`) |

**Uso en auth:**

- Registro → redirect a `{SITE_URL}/auth/callback`
- Olvidé contraseña → redirect a `{SITE_URL}/reset-password`

---

## Estructura del proyecto

```
account-camp/
├── proxy.ts                 # Proxy/middleware: refresca sesión Supabase en cada request
├── next.config.ts
├── components.json          # Configuración shadcn/ui
├── .env.example
├── .cursor/rules/           # Convenciones del repo (Cursor)
└── src/
    ├── app/                 # App Router (rutas y layouts)
    │   ├── layout.tsx       # Layout raíz (fuentes, metadata, lang="es")
    │   ├── globals.css
    │   ├── (public)/        # Landing pública
    │   ├── (auth)/          # Login, registro, callback, reset
    │   ├── (student)/       # Área estudiante (con StudentShell)
    │   ├── (teacher)/       # Área profesor (esqueleto)
    │   └── (admin)/         # Área admin (esqueleto)
    ├── components/
    │   ├── brand/           # BrandMark
    │   ├── motion/          # FadeIn, animaciones
    │   ├── shell/           # StudentShell, sidebar, header
    │   ├── student/         # Componentes del dominio estudiante
    │   └── ui/              # Primitivos shadcn (Button, Input, etc.)
    ├── features/            # Módulos por dominio (auth, courses, users)
    └── lib/
        ├── auth.ts          # Utilidades de roles (stub)
        ├── auth-errors.ts   # Errores de auth → mensajes en español
        ├── env.ts           # Validación de env vars (stub)
        ├── utils.ts         # cn(), helpers Tailwind
        └── supabase/
            ├── client.ts    # Cliente browser
            ├── server.ts    # Cliente server (cookies)
            └── routes.ts    # fetchPublishedRoutes()
```

### Alias de imports

En `tsconfig.json`: `@/*` → `./src/*`

Ejemplo: `import { Button } from "@/components/ui/button"`

---

## Rutas y áreas de la aplicación

Next.js usa **route groups** `(nombre)` para organizar layouts sin afectar la URL.

### Público — `(public)`

| Ruta | Descripción |
|------|-------------|
| `/` | Landing: bienvenida, links a login y registro |

### Auth — `(auth)`

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión con email/contraseña |
| `/register` | Registro con verificación por correo |
| `/forgot-password` | Solicitud de enlace de recuperación |
| `/reset-password` | Nueva contraseña (requiere sesión del enlace) |
| `/auth/callback` | Callback post-verificación de correo |

Layout auth: fondo oscuro con grid animado y orbes de marca.

### Estudiante — `(student)`

Protegido en cliente: `StudentShell` redirige a `/login` si no hay sesión.

| Ruta | Estado | Descripción |
|------|--------|-------------|
| `/student` | Placeholder | Dashboard con cards de progreso (skeleton) |
| `/student/routes` | **Implementado** | Listado de rutas profesionales desde Supabase |
| `/student/routes/[slug]` | Pendiente | Detalle de ruta (enlace existe en UI, ruta no creada) |
| `/student/progress` | Pendiente | En navegación, sin página |
| `/student/courses` | Pendiente | En navegación, sin página |
| `/student/practice` | Pendiente | En navegación, sin página |
| `/student/library` | Pendiente | En navegación, sin página |
| `/student/settings` | Pendiente | En navegación, sin página |

**Navegación lateral** (`StudentSidebar`): Inicio, Mi progreso, Cursos, Rutas, Práctica, Biblioteca, Configuración.

### Profesor — `(teacher)`

| Ruta | Descripción |
|------|-------------|
| `/teacher` | Esqueleto: gestión de cohortes |

### Admin — `(admin)`

| Ruta | Descripción |
|------|-------------|
| `/admin` | Esqueleto: panel de administración |

---

## Autenticación

### Proveedor

**Supabase Auth** con clientes SSR:

- **Browser:** `src/lib/supabase/client.ts` → `createBrowserClient`
- **Server:** `src/lib/supabase/server.ts` → `createServerClient` con cookies de Next.js

### Proxy de sesión

`proxy.ts` en la raíz ejecuta `supabase.auth.getUser()` en cada request para **refrescar la sesión** vía cookies. Matcher excluye assets estáticos e imágenes.

### Flujos implementados

1. **Login** (`/login`): `signInWithPassword` → redirect a `/student`.
2. **Registro** (`/register`): `signUp` con `full_name` en metadata → mensaje “Revisa tu correo”.
3. **Verificación** (`/auth/callback`): `getSession()` (no `exchangeCodeForSession` manual para evitar doble intercambio) → redirect a `/student`.
4. **Olvidé contraseña**: `resetPasswordForEmail` → email con link a `/reset-password`.
5. **Restablecer contraseña**: valida sesión del link → `updateUser({ password })`.
6. **Cerrar sesión**: `signOut()` desde el menú del header del estudiante.

### Errores de auth

`src/lib/auth-errors.ts` centraliza el mapeo de errores de Supabase a **mensajes en español**:

- `getAuthErrorMessage` — login
- `getSignUpErrorMessage` — registro
- `getVerificationErrorMessage` — callback
- `getResetPasswordErrorMessage` — reset

### Roles (pendiente)

`src/lib/auth.ts` define `UserRole` y funciones `getCurrentUser()` / `requireRole()`, pero son **stubs** (siempre retornan `null` / sin enforcement). La protección por rol en server aún no está implementada.

---

## Datos y Supabase

### Tablas referenciadas en código

| Tabla | Uso |
|-------|-----|
| `professional_routes` | Rutas publicadas (`is_published = true`) |
| `courses` | Cursos publicados |
| `route_courses` | Pivot ruta ↔ curso (para contar cursos por ruta) |

### Función principal de datos

`fetchPublishedRoutes()` en `src/lib/supabase/routes.ts`:

1. Obtiene rutas publicadas ordenadas por nombre.
2. Obtiene IDs de cursos publicados.
3. Cruza con `route_courses` para calcular `courseCount` por ruta.
4. Retorna `RouteWithCount[]`.

Usada en la página server component `/student/routes`.

### Features (módulos de dominio)

| Módulo | Ubicación | Estado |
|--------|-----------|--------|
| `auth` | `src/features/auth/` | Tipos `User`, `Session` exportados |
| `courses` | `src/features/courses/` | Esqueleto vacío |
| `users` | `src/features/users/` | Esqueleto vacío |

---

## Componentes y UI

### Design system

- **shadcn/ui** (Radix + CVA + Tailwind), configurado en `components.json`.
- Base color: `stone`. CSS variables en `globals.css`.
- Componentes UI actuales: `button`, `input`, `label`, `checkbox`, `separator`.

### Shell del estudiante

| Componente | Responsabilidad |
|------------|-----------------|
| `StudentShell` | Auth guard, estado sidebar, layout principal |
| `StudentSidebar` | Navegación desktop (colapsable, persiste en `localStorage`) |
| `MobileSidebar` | Navegación móvil |
| `StudentHeader` | Búsqueda, notificaciones, menú usuario, logout |
| `SkeletonShell` | Loading mientras valida sesión |

### Animaciones

- `FadeIn` — entrada suave en páginas y formularios.
- Framer Motion en listados (`RoutesList`) y callback de auth.

---

## Convenciones del equipo

Definidas en `.cursor/rules/`:

### Idioma

| Capa | Idioma |
|------|--------|
| Código (variables, funciones, tipos, comentarios) | **Inglés** |
| UI (botones, labels, errores, empty states) | **Español (LatAm neutral)** |

### Patrones Next.js

- **Server Components** por defecto; `"use client"` solo cuando hay estado, effects o APIs del browser.
- Data fetching cerca de la ruta (server side).
- Validación con Zod en formularios.
- Mensajes de error accionables en español.

### Calidad

- TypeScript estricto, evitar `any`.
- Diffs mínimos; no reformatear archivos no relacionados.
- Tests solo para lógica crítica si el framework ya existe.

---

## Scripts disponibles

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo (`next dev`) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |

---

## Estado actual y pendientes

### Implementado

- [x] Auth completo con Supabase (login, registro, verificación, reset)
- [x] Shell de estudiante con navegación y logout
- [x] Listado de rutas profesionales desde Supabase
- [x] Mapeo de errores de auth a español
- [x] UI de auth con validación Zod + react-hook-form

### En progreso / pendiente

- [ ] Protección de rutas por rol (`requireRole`, middleware por rol)
- [ ] Páginas de navegación estudiante (progreso, cursos, práctica, biblioteca, settings)
- [ ] Detalle de ruta `/student/routes/[slug]`
- [ ] Áreas teacher y admin (solo esqueletos)
- [ ] Módulos `features/courses` y `features/users`
- [ ] i18n centralizado (`src/i18n/es-419.json`)
- [ ] Páginas legales referenciadas (`/terms`, `/privacy`)
- [ ] Validación runtime de env vars en `src/lib/env.ts`

---

## Diagrama de arquitectura (alto nivel)

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
├─────────────┬──────────────┬──────────────┬─────────────┤
│  (public)   │   (auth)     │  (student)   │ teacher/admin│
│  Landing    │ Login/Register│ StudentShell │  Stubs      │
└──────┬──────┴──────┬───────┴──────┬───────┴──────┬──────┘
       │               │              │              │
       └───────────────┴──────────────┴──────────────┘
                              │
                    proxy.ts (refresh session)
                              │
                    ┌─────────▼─────────┐
                    │     Supabase      │
                    │  Auth + Postgres  │
                    └───────────────────┘
```

---

## Contacto y recursos

- **Supabase Dashboard:** configurar auth redirects y tablas.
- **Convenciones locales:** ver `.cursor/rules/` en el repo.

---

*Última actualización: junio 2025 — revisar este documento cuando se agreguen rutas o módulos nuevos.*
