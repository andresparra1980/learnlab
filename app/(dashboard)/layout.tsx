'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/authStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Trophy,
  BarChart3,
  Gamepad2,
  Users
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated, loading, signOut, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const navigationItems = user?.role === 'teacher' ? [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Vista general'
    },
    {
      name: 'Mis Cursos',
      href: '/admin/courses',
      icon: BookOpen,
      description: 'Gestionar cursos'
    },
    {
      name: 'Estudiantes',
      href: '/admin/students',
      icon: Users,
      description: 'Ver estudiantes'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Estadísticas'
    },
    {
      name: 'Perfil',
      href: '/profile',
      icon: User,
      description: 'Mi perfil'
    }
  ] : [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Vista general'
    },
    {
      name: 'Mis Cursos',
      href: '/courses',
      icon: BookOpen,
      description: 'Cursos disponibles'
    },
    {
      name: 'Juegos',
      href: '/games',
      icon: Gamepad2,
      description: 'Juegos educativos'
    },
    {
      name: 'Logros',
      href: '/achievements',
      icon: Trophy,
      description: 'Mis logros'
    },
    {
      name: 'Progreso',
      href: '/progress',
      icon: BarChart3,
      description: 'Mi progreso'
    },
    {
      name: 'Perfil',
      href: '/profile',
      icon: User,
      description: 'Mi perfil'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              LearnLab
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.email}
              </p>
              <Badge variant="secondary" className="text-xs">
                {user.role === 'student' ? 'Estudiante' : 
                 user.role === 'teacher' ? 'Profesor' : 'Administrador'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Settings and logout */}
        <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <Link
              href="/settings"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
              Configuración
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:static fixed top-0 left-0 right-0 z-40 lg:z-10">
          <div className="flex items-center h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Bienvenido de vuelta, {user.first_name || 'Usuario'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}