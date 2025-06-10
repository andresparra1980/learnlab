# 🗄️ SUPABASE DATABASE SCHEMA - LEARNLAB

Definición completa del esquema de base de datos para la plataforma educativa LearnLab basada en la información real del proyecto Supabase.

## 📋 ÍNDICE

1. [Información del Proyecto](#información-del-proyecto)
2. [Extensiones Habilitadas](#extensiones-habilitadas)
3. [Esquema de Tablas](#esquema-de-tablas)
4. [Relaciones entre Tablas](#relaciones-entre-tablas)
5. [Políticas RLS](#políticas-rls)
6. [Scripts de Migración](#scripts-de-migración)

---

## 🏗️ INFORMACIÓN DEL PROYECTO

- **Proyecto ID**: `project-id`
- **Plataforma**: Supabase
- **Base de Datos**: PostgreSQL 15
- **Esquema Principal**: `public`

---

## 🔧 EXTENSIONES HABILITADAS

```sql
-- Extensiones esenciales ya instaladas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_graphql" SCHEMA graphql;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "supabase_vault" SCHEMA vault;
CREATE EXTENSION IF NOT EXISTS "plpgsql" SCHEMA pg_catalog;
```

**Extensiones Disponibles** (no instaladas):
- `postgis` - Tipos geoespaciales
- `vector` - Búsqueda vectorial con embeddings
- `pg_cron` - Tareas programadas
- `http` - Cliente HTTP para PostgreSQL
- `pgjwt` - JSON Web Tokens
- Y muchas más...

---

## 📊 ESQUEMA DE TABLAS

### 1. 👥 TABLA: `profiles`

**Propósito**: Gestión de usuarios y perfiles de la plataforma.

```sql
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT profiles_role_check 
        CHECK (role = ANY (ARRAY['student', 'teacher', 'admin'])),
    
    -- Foreign Key
    CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Índices existentes
CREATE UNIQUE INDEX profiles_email_idx ON public.profiles (email);
```

**Estadísticas**: 2 filas activas, 48 kB de tamaño

### 2. 📚 TABLA: `courses`

**Propósito**: Cursos educativos creados por profesores.

```sql
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    difficulty_level TEXT DEFAULT 'beginner',
    estimated_duration INTEGER, -- en minutos
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT courses_difficulty_level_check 
        CHECK (difficulty_level = ANY (ARRAY['beginner', 'intermediate', 'advanced'])),
    
    -- Foreign Key
    CONSTRAINT courses_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 0 filas activas, 32 kB de tamaño

### 3. 📖 TABLA: `modules`

**Propósito**: Módulos que pertenecen a un curso específico.

```sql
CREATE TABLE public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    unlock_requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Foreign Key
    CONSTRAINT modules_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 0 filas activas, 24 kB de tamaño

### 4. 📝 TABLA: `lessons`

**Propósito**: Lecciones individuales dentro de cada módulo.

```sql
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID NOT NULL,
    title TEXT NOT NULL,
    content JSONB, -- Contenido flexible: texto, video, quiz, etc.
    lesson_type TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    estimated_duration INTEGER, -- en minutos
    unlock_requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT lessons_lesson_type_check 
        CHECK (lesson_type = ANY (ARRAY['text', 'video', 'quiz', 'game'])),
    
    -- Foreign Key
    CONSTRAINT lessons_module_id_fkey 
        FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 0 filas activas, 24 kB de tamaño

### 5. 📈 TABLA: `user_progress`

**Propósito**: Seguimiento del progreso de usuarios en lecciones.

```sql
CREATE TABLE public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    status TEXT DEFAULT 'not_started',
    score INTEGER, -- 0-100
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- en segundos
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT user_progress_status_check 
        CHECK (status = ANY (ARRAY['not_started', 'in_progress', 'completed'])),
    CONSTRAINT user_progress_score_check 
        CHECK (score >= 0 AND score <= 100),
    
    -- Foreign Keys
    CONSTRAINT user_progress_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT user_progress_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 0 filas activas, 24 kB de tamaño

### 6. 🏆 TABLA: `achievements`

**Propósito**: Logros disponibles en la plataforma.

```sql
CREATE TABLE public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT, -- Nombre del icono o URL
    points INTEGER DEFAULT 0,
    requirements JSONB NOT NULL, -- Condiciones para obtener el logro
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS habilitado
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 5 filas activas, 32 kB de tamaño

### 7. 🎖️ TABLA: `user_achievements`

**Propósito**: Logros obtenidos por usuarios.

```sql
CREATE TABLE public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT now(),
    
    -- Foreign Keys
    CONSTRAINT user_achievements_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT user_achievements_achievement_id_fkey 
        FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE
);

-- RLS habilitado
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
```

**Estadísticas**: 0 filas activas, 16 kB de tamaño

---

## 🔗 RELACIONES ENTRE TABLAS

### Diagrama de Relaciones

```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles
    ↓ (1:N)
courses ← created_by
    ↓ (1:N)
modules
    ↓ (1:N)
lessons
    ↓ (N:M via user_progress)
profiles

profiles
    ↓ (N:M via user_achievements)
achievements
```

### Relaciones Específicas

1. **profiles → auth.users**: 1:1 (profiles.id → auth.users.id)
2. **courses → profiles**: N:1 (courses.created_by → profiles.id)
3. **modules → courses**: N:1 (modules.course_id → courses.id)
4. **lessons → modules**: N:1 (lessons.module_id → modules.id)
5. **user_progress**: Junction table (profiles ←→ lessons)
6. **user_achievements**: Junction table (profiles ←→ achievements)

---

## 🔒 POLÍTICAS RLS (Row Level Security)

### Configuración Base para todas las tablas

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
```

### Políticas Recomendadas

#### Para `profiles`
```sql
-- Usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Profesores pueden ver perfiles de estudiantes
CREATE POLICY "Teachers can view students" ON public.profiles
    FOR SELECT USING (
        role = 'student' OR auth.uid() = id
    );
```

#### Para `courses`
```sql
-- Todos pueden ver cursos publicados
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

-- Profesores pueden gestionar sus propios cursos
CREATE POLICY "Teachers can manage own courses" ON public.courses
    FOR ALL USING (created_by = auth.uid());
```

#### Para `user_progress`
```sql
-- Usuarios pueden gestionar su propio progreso
CREATE POLICY "Users can manage own progress" ON public.user_progress
    FOR ALL USING (user_id = auth.uid());

-- Profesores pueden ver progreso en sus cursos
CREATE POLICY "Teachers can view student progress" ON public.user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            JOIN public.modules m ON l.module_id = m.id
            JOIN public.courses c ON m.course_id = c.id
            WHERE l.id = lesson_id AND c.created_by = auth.uid()
        )
    );
```

---

## 📊 SCRIPTS DE MIGRACIÓN COMPLETOS

### Migración 001: Schema Inicial

```sql
-- 001_initial_schema.sql
BEGIN;

-- Crear tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT profiles_role_check 
        CHECK (role = ANY (ARRAY['student', 'teacher', 'admin'])),
    CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear tabla courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT false,
    difficulty_level TEXT DEFAULT 'beginner',
    estimated_duration INTEGER,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT courses_difficulty_level_check 
        CHECK (difficulty_level = ANY (ARRAY['beginner', 'intermediate', 'advanced'])),
    CONSTRAINT courses_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Crear tabla modules
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    unlock_requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT modules_course_id_fkey 
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Crear tabla lessons
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID NOT NULL,
    title TEXT NOT NULL,
    content JSONB,
    lesson_type TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    estimated_duration INTEGER,
    unlock_requirements JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT lessons_lesson_type_check 
        CHECK (lesson_type = ANY (ARRAY['text', 'video', 'quiz', 'game'])),
    CONSTRAINT lessons_module_id_fkey 
        FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE
);

-- Crear tabla user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    status TEXT DEFAULT 'not_started',
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT user_progress_status_check 
        CHECK (status = ANY (ARRAY['not_started', 'in_progress', 'completed'])),
    CONSTRAINT user_progress_score_check 
        CHECK (score >= 0 AND score <= 100),
    CONSTRAINT user_progress_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT user_progress_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE
);

-- Crear tabla achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    points INTEGER DEFAULT 0,
    requirements JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla user_achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT now(),
    
    CONSTRAINT user_achievements_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT user_achievements_achievement_id_fkey 
        FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

COMMIT;
```

### Migración 002: Funciones y Triggers

```sql
-- 002_functions_triggers.sql
BEGIN;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON public.courses 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at 
    BEFORE UPDATE ON public.modules 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
    BEFORE UPDATE ON public.lessons 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON public.user_progress 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger para auto-crear perfil
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
```

### Migración 003: Datos de Ejemplo

```sql
-- 003_sample_data.sql
BEGIN;

-- Insertar logros de ejemplo
INSERT INTO public.achievements (title, description, icon, points, requirements) VALUES
('🎯 Primer Paso', 'Completa tu primera lección', '🎯', 10, '{"lessons_completed": 1}'),
('📚 Estudiante Dedicado', 'Completa 5 lecciones', '📚', 50, '{"lessons_completed": 5}'),
('🎯 Experto en Quiz', 'Obtén 100% en un quiz', '🎯', 25, '{"perfect_quiz": true}'),
('🔥 Racha de Aprendizaje', 'Estudia 7 días consecutivos', '🔥', 100, '{"consecutive_days": 7}'),
('🏆 Maestro del Conocimiento', 'Completa un curso completo', '🏆', 200, '{"courses_completed": 1}');

COMMIT;
```

---

## 🚀 INSTRUCCIONES DE IMPLEMENTACIÓN

### 1. Configurar Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Comandos de Supabase

```bash
# Conectar al proyecto
supabase link --project-ref project-id

# Aplicar migraciones
supabase db push

# Generar tipos TypeScript
supabase gen types typescript --project-id project-id > types/database.ts
```

### 3. Verificar Instalación

```sql
-- Verificar tablas creadas
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar relaciones
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';
```

---

## 📝 NOTAS IMPORTANTES

### ✅ Estado Actual
- ✅ 7 tablas creadas correctamente
- ✅ RLS habilitado en todas las tablas
- ✅ Relaciones FK configuradas
- ✅ Constraints de validación activos
- ✅ 5 logros de ejemplo insertados

### ⚠️ Pendientes
- Políticas RLS específicas por tabla
- Índices optimizados para consultas
- Triggers de updated_at
- Función de auto-creación de perfiles

### 🎯 Siguientes Pasos
1. Implementar políticas RLS detalladas
2. Agregar índices para optimización
3. Configurar triggers automáticos
4. Poblar con datos de ejemplo más completos
5. Configurar webhooks para eventos

---

**Proyecto**: LearnLab Educational Platform  
**Supabase Project ID**: project-id  
**Schema Version**: 1.0.0  
**Última actualización**: 2024-01-15 