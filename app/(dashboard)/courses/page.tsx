'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Play,
  CheckCircle,
  Lock
} from 'lucide-react'


interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number
  total_lessons: number
  completed_lessons: number
  enrolled_students: number
  rating: number
  is_enrolled: boolean
  progress: number
  instructor: string
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Mock data for now - we'll replace this with real API calls later
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Introducción a la Biología',
        description: 'Aprende los conceptos fundamentales de la biología de manera interactiva y divertida.',
        difficulty_level: 'beginner',
        estimated_duration: 120,
        total_lessons: 15,
        completed_lessons: 8,
        enrolled_students: 1234,
        rating: 4.8,
        is_enrolled: true,
        progress: 53,
        instructor: 'Dr. María González'
      },
      {
        id: '2',
        title: 'Matemáticas Básicas',
        description: 'Domina las operaciones matemáticas básicas con ejercicios prácticos y juegos.',
        difficulty_level: 'beginner',
        estimated_duration: 90,
        total_lessons: 12,
        completed_lessons: 0,
        enrolled_students: 987,
        rating: 4.6,
        is_enrolled: false,
        progress: 0,
        instructor: 'Prof. Carlos Ramírez'
      },
      {
        id: '3',
        title: 'Historia Mundial',
        description: 'Un viaje a través de los eventos más importantes que han moldeado nuestro mundo.',
        difficulty_level: 'intermediate',
        estimated_duration: 180,
        total_lessons: 20,
        completed_lessons: 12,
        enrolled_students: 756,
        rating: 4.9,
        is_enrolled: true,
        progress: 60,
        instructor: 'Dra. Ana Ruiz'
      },
      {
        id: '4',
        title: 'Física Avanzada',
        description: 'Explora los principios fundamentales de la física con experimentos virtuales.',
        difficulty_level: 'advanced',
        estimated_duration: 240,
        total_lessons: 25,
        completed_lessons: 0,
        enrolled_students: 342,
        rating: 4.7,
        is_enrolled: false,
        progress: 0,
        instructor: 'Dr. Luis Mendoza'
      },
      {
        id: '5',
        title: 'Química Orgánica',
        description: 'Comprende las reacciones y estructuras de los compuestos orgánicos.',
        difficulty_level: 'advanced',
        estimated_duration: 200,
        total_lessons: 18,
        completed_lessons: 0,
        enrolled_students: 445,
        rating: 4.5,
        is_enrolled: false,
        progress: 0,
        instructor: 'Dra. Patricia Vega'
      },
      {
        id: '6',
        title: 'Geografía Mundial',
        description: 'Descubre países, capitales, y características geográficas del mundo.',
        difficulty_level: 'intermediate',
        estimated_duration: 150,
        total_lessons: 16,
        completed_lessons: 5,
        enrolled_students: 678,
        rating: 4.4,
        is_enrolled: true,
        progress: 31,
        instructor: 'Prof. Roberto Silva'
      }
    ]

    // Simulate loading
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty_level === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const handleCourseClick = (course: Course) => {
    if (course.is_enrolled) {
      router.push(`/courses/${course.id}`)
    } else {
      // Handle enrollment logic here
      console.log('Enroll in course:', course.id)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mis Cursos
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Explora y continúa tu viaje de aprendizaje
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">Todas las dificultades</option>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total de Cursos</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">En Progreso</p>
                <p className="text-2xl font-bold">{courses.filter(c => c.is_enrolled && c.progress > 0 && c.progress < 100).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Completados</p>
                <p className="text-2xl font-bold">{courses.filter(c => c.progress === 100).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Promedio</p>
                <p className="text-2xl font-bold">4.7★</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {course.description}
                  </CardDescription>
                </div>
                {course.is_enrolled ? (
                  course.progress === 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Play className="h-5 w-5 text-blue-600" />
                  )
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <Badge className={difficultyColors[course.difficulty_level]}>
                  {difficultyLabels[course.difficulty_level]}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.estimated_duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.total_lessons} lecciones</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled_students}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Instructor: {course.instructor}
                </div>
              </div>

              {course.is_enrolled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {course.completed_lessons} de {course.total_lessons} lecciones completadas
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={() => handleCourseClick(course)}
                variant={course.is_enrolled ? "default" : "outline"}
              >
                {course.is_enrolled 
                  ? course.progress === 100 
                    ? "Revisar Curso" 
                    : "Continuar Curso"
                  : "Inscribirse"
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron cursos
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Intenta ajustar tus filtros de búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}