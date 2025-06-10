'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Star,
  Calendar,
  Users,
  Gamepad2
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalCourses: number
  completedCourses: number
  totalLessons: number
  completedLessons: number
  totalPoints: number
  achievements: number
  studyTime: number
  streak: number
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalPoints: 0,
    achievements: 0,
    studyTime: 0,
    streak: 0
  })

  // Mock data for now - we'll replace this with real API calls later
  useEffect(() => {
    // Simulate loading stats
    const mockStats: DashboardStats = user?.role === 'teacher' ? {
      totalCourses: 5, // Cursos creados
      completedCourses: 3, // Cursos publicados
      totalLessons: 45, // Lecciones creadas
      completedLessons: 278, // Lecciones completadas por estudiantes
      totalPoints: 0, // No aplica para teachers
      achievements: 156, // Estudiantes totales
      studyTime: 1240, // Horas totales de estudio de estudiantes
      streak: 89 // Estudiantes activos
    } : {
      totalCourses: 8,
      completedCourses: 3,
      totalLessons: 45,
      completedLessons: 28,
      totalPoints: 1250,
      achievements: 12,
      studyTime: 67, // hours
      streak: 7 // days
    }
    setStats(mockStats)
  }, [user])

  const completionPercentage = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0

  const courseCompletionPercentage = stats.totalCourses > 0
    ? Math.round((stats.completedCourses / stats.totalCourses) * 100)
    : 0

  const recentAchievements = [
    { title: "Primera Lección", description: "Completaste tu primera lección", icon: "🎯" },
    { title: "Estudiante Dedicado", description: "7 días consecutivos estudiando", icon: "🔥" },
    { title: "Quiz Master", description: "100% en 5 quizzes consecutivos", icon: "🧠" }
  ]

  const upcomingLessons = [
    { title: "Introducción a la Fotosíntesis", course: "Biología Básica", duration: "15 min" },
    { title: "Teorema de Pitágoras", course: "Matemáticas", duration: "20 min" },
    { title: "La Revolución Industrial", course: "Historia Mundial", duration: "25 min" }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Hola, {user?.first_name || 'Estudiante'}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Continúa tu viaje de aprendizaje. Tienes {stats.totalLessons - stats.completedLessons} lecciones pendientes.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedLessons} de {stats.totalLessons} lecciones
            </p>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {courseCompletionPercentage}% completado
            </p>
            <Progress value={courseCompletionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +125 esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} días</div>
            <p className="text-xs text-muted-foreground">
              ¡Sigue así!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Continúa Aprendiendo
              </CardTitle>
              <CardDescription>
                Retoma donde lo dejaste
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.course}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {lesson.duration}
                    </Badge>
                    <Button size="sm">
                      Continuar
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/courses">
                    Ver Todos los Cursos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tiempo de Estudio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studyTime}h</div>
                <p className="text-xs text-muted-foreground">Total este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.achievements}</div>
                <p className="text-xs text-muted-foreground">Desbloqueados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#47</div>
                <p className="text-xs text-muted-foreground">De 1,234 estudiantes</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full">
                <Link href="/achievements">
                  Ver Todos los Logros
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Study Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl">🔥</div>
                <div className="text-lg font-semibold">{stats.streak} días</div>
                <p className="text-sm text-muted-foreground">Racha actual</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/progress">
                    Ver Progreso Detallado
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/games">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Jugar un Juego
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explorar Cursos
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/profile">
                  <Target className="mr-2 h-4 w-4" />
                  Establecer Meta
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}