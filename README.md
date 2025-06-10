# 🎓 LearnLab - Plataforma Educativa Gamificada

<div align="center">
  <h2>Plataforma de aprendizaje interactiva con sistema de logros y gamificación</h2>
  <p>Construida con Next.js 15.3.3, Supabase, TypeScript y Tailwind CSS</p>
</div>

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecutar el Proyecto](#️-ejecutar-el-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Datos](#️-base-de-datos)
- [Despliegue](#-despliegue)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🎯 Descripción del Proyecto

LearnLab es una plataforma educativa moderna que combina aprendizaje tradicional con elementos de gamificación. Permite a los profesores crear cursos interactivos y a los estudiantes progresar a través de lecciones, obtener logros y seguir su progreso de aprendizaje.

### 👥 Roles de Usuario
- **Estudiantes**: Acceden a cursos, completan lecciones, obtienen logros
- **Profesores**: Crean y gestionan cursos, módulos y lecciones
- **Administradores**: Gestión completa de la plataforma

---

## ✨ Características Principales

- 🎮 **Sistema de Gamificación**: Logros, puntos y progreso visual
- 📚 **Gestión de Cursos**: Creación y administración de contenido educativo
- 📊 **Dashboard de Analytics**: Métricas de progreso para profesores
- 🔐 **Autenticación Segura**: Sistema completo con roles y permisos
- 📱 **Responsive Design**: Funciona en desktop, tablet y móvil
- 🌙 **Modo Oscuro**: Interfaz adaptable con tema claro/oscuro
- ⚡ **Tiempo Real**: Actualizaciones en vivo con Supabase
- 🎯 **Sistema de Progreso**: Seguimiento detallado del aprendizaje

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL con Row Level Security (RLS)

---

## 📋 Requisitos Previos

### Para todos los sistemas operativos:
- **Node.js** (versión 18.0 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)
- **Cuenta de Supabase** (gratuita en [supabase.com](https://supabase.com))

---

## 🚀 Instalación

### 🪟 Windows

#### Paso 1: Instalar Node.js
1. Descarga Node.js desde [nodejs.org](https://nodejs.org/)
2. Ejecuta el instalador `.msi` y sigue las instrucciones
3. Verifica la instalación:
```cmd
node --version
npm --version
```

#### Paso 2: Instalar Git (si no está instalado)
1. Descarga Git desde [git-scm.com](https://git-scm.com/download/win)
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica: `git --version`

#### Paso 3: Clonar y configurar el proyecto
```cmd
# Clonar el repositorio
git clone https://github.com/andresparra1980/learnlab
cd learnlab

# Instalar dependencias
npm install

# Copiar archivo de configuración
copy .env.example .env.local
```

### 🐧 Linux

#### Paso 1: Instalar Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL/Fedora
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs npm

# Arch Linux
sudo pacman -S nodejs npm

# Verificar instalación
node --version
npm --version
```

#### Paso 2: Instalar Git (si no está instalado)
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# CentOS/RHEL/Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

#### Paso 3: Clonar y configurar el proyecto
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/learnlab.git
cd learnlab

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env.local
```

### 🍎 macOS

#### Paso 1: Instalar Homebrew (si no está instalado)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Paso 2: Instalar Node.js y Git
```bash
# Instalar Node.js
brew install node

# Instalar Git (si no está instalado)
brew install git

# Verificar instalaciones
node --version
npm --version
git --version
```

#### Paso 3: Clonar y configurar el proyecto
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/learnlab.git
cd learnlab

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env.local
```

---

## ⚙️ Configuración

### 1. Configurar Supabase

#### Crear proyecto en Supabase:
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia tu `Project URL` y `anon key`

#### Configurar variables de entorno:
Edita el archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configurar Base de Datos

Consulta el archivo `SUPABASE_DEFINITION.md` para el esquema completo y scripts de migración.

---

## 🏃‍♂️ Ejecutar el Proyecto

### Modo Desarrollo

```bash
# Comando principal (todos los sistemas)
npm run dev
```

**El proyecto estará disponible en:** [http://localhost:3000](http://localhost:3000)

### Comandos por Sistema Operativo

#### Windows:
```cmd
# Desarrollo normal
npm run dev

# Con puerto específico
set PORT=3001 && npm run dev

# Con debug
set DEBUG=* && npm run dev
```

#### Linux/macOS:
```bash
# Desarrollo normal
npm run dev

# Con puerto específico
PORT=3001 npm run dev

# Con debug
DEBUG=* npm run dev

# Con Turbopack (más rápido)
npm run dev:turbo
```

---

## 📜 Scripts Disponibles

| Script | Descripción | Comando |
|--------|-------------|---------|
| **Desarrollo** | Servidor de desarrollo | `npm run dev` |
| **Desarrollo Turbo** | Con Turbopack (experimental) | `npm run dev:turbo` |
| **Build** | Construir para producción | `npm run build` |
| **Start** | Ejecutar versión de producción | `npm run start` |
| **Lint** | Verificar código con ESLint | `npm run lint` |
| **Types** | Generar tipos de Supabase | `npm run db:generate-types` |
| **DB Reset** | Resetear base de datos | `npm run db:reset` |
| **DB Migrate** | Aplicar migraciones | `npm run db:migrate` |

---

## 🗄️ Base de Datos

### Esquema Principal

- **profiles**: Perfiles de usuarios con roles
- **courses**: Cursos educativos creados por profesores
- **modules**: Módulos que pertenecen a cursos
- **lessons**: Lecciones individuales con contenido
- **user_progress**: Seguimiento de progreso de estudiantes
- **achievements**: Sistema de logros gamificados
- **user_achievements**: Logros obtenidos por usuarios

**Para más detalles:** Consulta `SUPABASE_DEFINITION.md`

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de entorno para producción:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_produccion
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_produccion
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

---

## 🐛 Solución de Problemas

### Problemas Comunes

#### ❌ Error de permisos (Windows)
```cmd
# Ejecutar como administrador
npm cache clean --force
npm install
```

#### ❌ Error de permisos (Linux/macOS)
```bash
# Cambiar propietario de npm
sudo chown -R $(whoami) ~/.npm
npm install
```

#### ❌ Puerto 3000 ocupado
```bash
# Windows
netstat -ano | findstr :3000

# Linux/macOS
lsof -i :3000

# Usar otro puerto
PORT=3001 npm run dev
```

#### ❌ Error de conexión a Supabase
1. ✅ Verifica las variables en `.env.local`
2. ✅ Confirma que el proyecto de Supabase esté activo
3. ✅ Revisa que las URL y keys sean correctas

#### ❌ Dependencias no se instalan
```bash
# Limpiar cache y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Estructura del Proyecto

```
learnlab/
├── app/                     # App Router de Next.js 15
│   ├── (auth)/             # Rutas de autenticación
│   ├── (dashboard)/        # Dashboard principal
│   ├── admin/              # Panel de administración
│   └── globals.css         # Estilos globales
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── auth/               # Componentes de autenticación
│   └── dashboard/          # Componentes del dashboard
├── lib/                    # Utilidades y configuración
│   ├── supabase/          # Cliente de Supabase
│   ├── stores/            # Estado global (Zustand)
│   └── utils.ts           # Funciones utilitarias
├── types/                  # Definiciones TypeScript
├── hooks/                  # Custom hooks
├── public/                 # Archivos estáticos
├── .env.local             # Variables de entorno (local)
├── package.json           # Dependencias del proyecto
└── SUPABASE_DEFINITION.md # Esquema de base de datos
```

---

## 🤝 Contribuir

1. Fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

<div align="center">
  <p>🚀 <strong>¡Listo para empezar tu viaje educativo!</strong> 🎓</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> • 
    <a href="https://supabase.com">Supabase</a> • 
    <a href="https://tailwindcss.com">Tailwind CSS</a>
  </p>
</div> 