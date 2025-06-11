'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/lib/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  Search,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  Target,
  Activity
} from 'lucide-react'

interface Student {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  created_at: string
  avatar_url?: string | null
  courses: {
    id: string
    title: string
    progress: number
    lastActivity: string
    status: 'not_started' | 'in_progress' | 'completed'
    averageScore: number
  }[]
  totalProgress: number
  coursesCompleted: number
  studyTime: number
  achievements: number
}

interface Course {
  id: string
  title: string
}

const supabase = createClient()

export default function StudentsPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const fetchData = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Fetch courses created by teacher
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('created_by', user.id)

      if (coursesError) throw coursesError
      setCourses(coursesData || [])

      // Mock student data - in a real app, you'd get this from actual enrollments
      const mockStudents: Student[] = [
        {
          id: '1',
          first_name: 'María',
          last_name: 'García',
          email: 'maria.garcia@email.com',
          created_at: '2024-01-10T00:00:00Z',
          courses: [
            {
              id: 'course-1',
              title: 'Introducción a la Biología',
              progress: 85,
              lastActivity: '2 horas',
              status: 'in_progress',
              averageScore: 92
            },
            {
              id: 'course-2',
              title: 'Matemáticas Básicas',
              progress: 100,
              lastActivity: '1 día',
              status: 'completed',
              averageScore: 88
            }
          ],
          totalProgress: 92,
          coursesCompleted: 1,
          studyTime: 45,
          achievements: 8
        },
        {
          id: '2',
          first_name: 'Carlos',
          last_name: 'López',
          email: 'carlos.lopez@email.com',
          created_at: '2024-01-08T00:00:00Z',
          courses: [
            {
              id: 'course-1',
              title: 'Introducción a la Biología',
              progress: 65,
              lastActivity: '5 horas',
              status: 'in_progress',
              averageScore: 78
            }
          ],
          totalProgress: 65,
          coursesCompleted: 0,
          studyTime: 28,
          achievements: 4
        },
        {
          id: '3',
          first_name: 'Ana',
          last_name: 'Ruiz',
          email: 'ana.ruiz@email.com',
          created_at: '2024-01-05T00:00:00Z',
          courses: [
            {
              id: 'course-3',
              title: 'Historia Mundial',
              progress: 72,
              lastActivity: '3 horas',
              status: 'in_progress',
              averageScore: 94
            },
            {
              id: 'course-1',
              title: 'Introducción a la Biología',
              progress: 100,
              lastActivity: '2 días',
              status: 'completed',
              averageScore: 96
            }
          ],
          totalProgress: 86,
          coursesCompleted: 1,
          studyTime: 67,
          achievements: 12
        },
        {
          id: '4',
          first_name: 'Pedro',
          last_name: 'Silva',
          email: 'pedro.silva@email.com',
          created_at: '2024-01-12T00:00:00Z',
          courses: [
            {
              id: 'course-4',
              title: 'Física Avanzada',
              progress: 34,
              lastActivity: '1 día',
              status: 'in_progress',
              averageScore: 82
            }
          ],
          totalProgress: 34,
          coursesCompleted: 0,
          studyTime: 15,
          achievements: 2
        }
      ]

      setStudents(mockStudents)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'in_progress':
        return 'En Progreso'
      default:
        return 'No Iniciado'
    }
  }

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCourse = selectedCourse === 'all' || 
                           student.courses.some(course => course.id === selectedCourse)
      
      return matchesSearch && matchesCourse
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.totalProgress - a.totalProgress
        case 'activity':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return (a.first_name || a.email).localeCompare(b.first_name || b.email)
      }
    })

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
          Mis Estudiantes
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Gestiona y monitorea el progreso de tus estudiantes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="progress">Progreso</SelectItem>
              <SelectItem value="activity">Actividad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Estudiantes</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Activos Hoy</p>
                <p className="text-2xl font-bold">{students.filter(s => s.courses.some(c => c.lastActivity.includes('hora'))).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Progreso Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(students.reduce((acc, s) => acc + s.totalProgress, 0) / students.length || 0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Cursos Completados</p>
                <p className="text-2xl font-bold">
                  {students.reduce((acc, s) => acc + s.coursesCompleted, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {(student.first_name?.[0] || student.email[0]).toUpperCase()}
                      {(student.last_name?.[0] || '').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {student.first_name && student.last_name 
                          ? `${student.first_name} ${student.last_name}`
                          : student.email
                        }
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Registrado {new Date(student.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Progreso General</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={student.totalProgress} className="flex-1 h-2" />
                          <span className="font-medium">{student.totalProgress}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Cursos Activos</p>
                        <p className="font-medium mt-1">{student.courses.length}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Tiempo de Estudio</p>
                        <p className="font-medium mt-1">{student.studyTime}h</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Logros</p>
                        <p className="font-medium mt-1">{student.achievements}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cursos:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Badge className={getStatusColor(course.status)}>
                              {getStatusLabel(course.status)}
                            </Badge>
                            <span className="text-gray-600 dark:text-gray-300">
                              {course.title} ({course.progress}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contactar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCourse !== 'all' ? 'No se encontraron estudiantes' : 'No tienes estudiantes'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || selectedCourse !== 'all'
              ? 'Intenta ajustar tus filtros de búsqueda.'
              : 'Los estudiantes aparecerán aquí cuando se inscriban en tus cursos.'
            }
          </p>
        </div>
      )}
    </div>
  )
} 