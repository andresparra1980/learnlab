'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/lib/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Star
} from 'lucide-react'

interface AnalyticsData {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  activeStudents: number
  totalLessons: number
  completedLessons: number
  averageScore: number
  totalStudyTime: number
  recentActivity: {
    date: string
    activity: string
    student: string
    course: string
  }[]
  topCourses: {
    id: string
    title: string
    students: number
    completionRate: number
    averageScore: number
  }[]
  studentProgress: {
    name: string
    course: string
    progress: number
    lastActive: string
  }[]
}

const supabase = createClient()

export default function AnalyticsPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    totalStudyTime: 0,
    recentActivity: [],
    topCourses: [],
    studentProgress: []
  })
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Fetch courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('created_by', user.id)

      if (coursesError) throw coursesError

      // Mock analytics data - in a real app, you'd calculate these from the database
      const mockAnalytics: AnalyticsData = {
        totalCourses: courses?.length || 0,
        publishedCourses: courses?.filter(c => c.is_published).length || 0,
        totalStudents: 156,
        activeStudents: 89,
        totalLessons: 45,
        completedLessons: 278,
        averageScore: 85,
        totalStudyTime: 1240, // hours
        recentActivity: [
          {
            date: '2024-01-15',
            activity: 'Completó lección',
            student: 'María García',
            course: 'Introducción a la Biología'
          },
          {
            date: '2024-01-15',
            activity: 'Nuevo registro',
            student: 'Carlos López',
            course: 'Matemáticas Básicas'
          },
          {
            date: '2024-01-14',
            activity: 'Quiz completado',
            student: 'Ana Ruiz',
            course: 'Historia Mundial'
          },
          {
            date: '2024-01-14',
            activity: 'Logro desbloqueado',
            student: 'Pedro Silva',
            course: 'Física Avanzada'
          }
        ],
        topCourses: [
          {
            id: '1',
            title: 'Introducción a la Biología',
            students: 45,
            completionRate: 78,
            averageScore: 88
          },
          {
            id: '2',
            title: 'Matemáticas Básicas',
            students: 38,
            completionRate: 85,
            averageScore: 82
          },
          {
            id: '3',
            title: 'Historia Mundial',
            students: 32,
            completionRate: 72,
            averageScore: 90
          }
        ],
        studentProgress: [
          {
            name: 'María García',
            course: 'Introducción a la Biología',
            progress: 85,
            lastActive: '2 horas'
          },
          {
            name: 'Carlos López',
            course: 'Matemáticas Básicas',
            progress: 92,
            lastActive: '1 día'
          },
          {
            name: 'Ana Ruiz',
            course: 'Historia Mundial',
            progress: 67,
            lastActive: '3 horas'
          },
          {
            name: 'Pedro Silva',
            course: 'Física Avanzada',
            progress: 54,
            lastActive: '5 horas'
          }
        ]
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Estadísticas y métricas de tus cursos
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Totales</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.publishedCourses} publicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeStudents} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Calificaciones</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              En todos los cursos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudyTime}h</div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Cursos Más Populares
            </CardTitle>
            <CardDescription>
              Rendimiento de tus cursos mejor calificados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topCourses.map((course, index) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <Badge variant="secondary">{course.students} estudiantes</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completado</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Promedio</span>
                      <span>{course.averageScore}%</span>
                    </div>
                    <Progress value={course.averageScore} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas actividades de tus estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.student}</span> {activity.activity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.course} • {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Student Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progreso de Estudiantes
          </CardTitle>
          <CardDescription>
            Estado actual de tus estudiantes más activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.studentProgress.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{student.progress}%</span>
                      <Progress value={student.progress} className="w-20 h-2" />
                    </div>
                    <p className="text-xs text-gray-500">Activo hace {student.lastActive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Lecciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedLessons} completadas por estudiantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Tasa de Retención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((analytics.activeStudents / analytics.totalStudents) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Estudiantes activos del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Nivel de participación promedio
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 