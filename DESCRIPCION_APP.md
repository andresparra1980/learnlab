Perfecto, con Next.js 15.3.3 ya instalado. Aquí tienes la especificación ajustada:

## 🚀 LEARNLAB - Especificación para Next.js 15.3.3

### 🛠️ CONFIGURACIÓN INICIAL (Desde proyecto existente)

```bash
# Dependencias principales
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install framer-motion
npm install lucide-react
npm install next-themes

# UI Components (Shadcn/ui)
npx shadcn@latest init
npx shadcn@latest add button card input label textarea
npx shadcn@latest add dialog dropdown-menu progress
npx shadcn@latest add badge alert toast tabs
```

### 📁 ESTRUCTURA DE CARPETAS (Next.js 15.3.3)

```
/src
├── app/                         # App Router (Next.js 15)
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── loading.tsx             # Loading UI
│   ├── error.tsx               # Error boundary
│   │
│   ├── (auth)/                 # Route group - Auth
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/            # Route group - Protected
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [courseId]/
│   │   │       ├── page.tsx
│   │   │       └── modules/
│   │   │           └── [moduleId]/
│   │   │               ├── page.tsx
│   │   │               └── lessons/
│   │   │                   └── [lessonId]/
│   │   │                       └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── admin/                  # Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── courses/
│   │   ├── modules/
│   │   └── analytics/
│   │
│   └── api/                    # API Routes (Next.js 15)
│       ├── auth/
│       ├── courses/
│       └── progress/
│
├── components/
│   ├── ui/                     # Shadcn components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── ModuleProgress.tsx
│   │   ├── LessonContent.tsx
│   │   └── QuizComponent.tsx
│   ├── games/
│   │   ├── Crossword.tsx
│   │   ├── WordSearch.tsx
│   │   ├── Hangman.tsx
│   │   └── FillBlanks.tsx
│   └── admin/
│       ├── ContentEditor.tsx
│       ├── UserAnalytics.tsx
│       └── CourseManager.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── progressStore.ts
│   │   └── courseStore.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProgress.ts
│   │   └── useCourses.ts
│   └── utils/
│       ├── cn.ts               # Class name utility
│       ├── calculations.ts     # Score calculations
│       └── gameGenerators.ts   # Game content generators
│
├── types/
│   ├── database.ts             # Supabase generated types
│   ├── auth.ts
│   ├── course.ts
│   └── game.ts
│
└── styles/
    └── globals.css
```

### ⚙️ CONFIGURACIÓN ESPECÍFICA NEXT.JS 15.3.3

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true, // Next.js 15 feature
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
```

```typescript
// src/app/layout.tsx (Root Layout con Next.js 15)
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LearnLab - Educación Interactiva',
  description: 'Plataforma educativa gamificada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

### 🔧 CONFIGURACIÓN SUPABASE (Next.js 15)

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component - ignore
          }
        },
      },
    }
  )
}
```

### 🎯 PROVIDERS SETUP (Next.js 15)

```typescript
// src/components/Providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes (new in React Query 5)
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 🚀 COMANDOS DE INICIO RÁPIDO

```bash
# 1. Variables de entorno
cp .env.example .env.local
# Configurar SUPABASE_URL y SUPABASE_ANON_KEY

# 2. Instalar dependencias
npm install

# 3. Configurar Supabase
npx supabase init
npx supabase start
npx supabase db reset

# 4. Generar tipos de TypeScript
npx supabase gen types typescript --local > src/types/database.ts

# 5. Iniciar desarrollo
npm run dev
```

### 📋 ORDEN DE IMPLEMENTACIÓN CON NEXT.JS 15

#### PASO 1: Base Setup
1. **Configurar Supabase**: Cliente + Auth + Middleware
2. **Providers**: TanStack Query + Theme Provider
3. **Layout base**: Root layout + Dashboard layout
4. **Autenticación**: Login/Register pages

#### PASO 2: Sistema Core
1. **Database Schema**: Ejecutar migrations
2. **Auth Guard**: Middleware de protección de rutas
3. **Dashboard básico**: Homepage con navegación
4. **Visualización de cursos**: Lista de cursos disponibles

#### PASO 3: Funcionalidad Principal
1. **Sistema de progreso**: Lógica de desbloqueo
2. **Lecciones**: Componente de visualización
3. **Quizzes**: Sistema de evaluación
4. **Juegos**: Componentes interactivos

#### PASO 4: Admin Panel
1. **CRUD básico**: Courses, Modules, Lessons
2. **Content Editor**: Rich text editor
3. **Analytics**: Dashboard de estadísticas

### 🔧 SCRIPTS ÚTILES PARA PACKAGE.JSON

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate-types": "npx supabase gen types typescript --local > src/types/database.ts",
    "db:reset": "npx supabase db reset",
    "db:migrate": "npx supabase migration up"
  }
}
```

¿Quieres que empecemos con algún componente específico o prefieres que detalle más alguna parte de la arquitectura?

IMPORTANTE USEMOS yarn en el proyecto y no npm
