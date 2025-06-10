'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/lib/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Users,
  BarChart3,
  Eye,
  Play,
  Clock,
  Target
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number | null
  is_published: boolean
  created_at: string
  updated_at: string
  thumbnail_url?: string | null
  created_by: string
}

interface NewCourseData {
  title: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number
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

export default function AdminCoursesPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState<NewCourseData>({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    estimated_duration: 60
  })
  const [creating, setCreating] = useState(false)

  const fetchCourses = useCallback(async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los cursos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [user?.id, supabase, toast])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim() || !user?.id) {
      toast({
        title: 'Error',
        description: 'El título del curso es requerido',
        variant: 'destructive'
      })
      return
    }

    try {
      setCreating(true)
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          difficulty_level: newCourse.difficulty_level,
          estimated_duration: newCourse.estimated_duration,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      setCourses(prev => [data, ...prev])
      setCreateDialogOpen(false)
      setNewCourse({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        estimated_duration: 60
      })
      
      toast({
        title: 'Éxito',
        description: 'Curso creado correctamente'
      })
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el curso',
        variant: 'destructive'
      })
    } finally {
      setCreating(false)
    }
  }

  const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId)

      if (error) throw error

      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, is_published: !currentStatus }
            : course
        )
      )

      toast({
        title: 'Éxito',
        description: `Curso ${!currentStatus ? 'publicado' : 'despublicado'} correctamente`
      })
    } catch (error) {
      console.error('Error updating course status:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del curso',
        variant: 'destructive'
      })
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Crea y administra tus cursos educativos
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
              <DialogDescription>
                Completa la información básica para crear un nuevo curso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Curso</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Introducción a la Biología"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe qué aprenderán los estudiantes..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                <Select 
                  value={newCourse.difficulty_level} 
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    setNewCourse(prev => ({ ...prev, difficulty_level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duración Estimada (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newCourse.estimated_duration}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || 60 }))}
                  min="1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateCourse} disabled={creating} className="flex-1">
                  {creating ? 'Creando...' : 'Crear Curso'}
                </Button>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Cursos</p>
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
                <p className="text-sm font-medium">Publicados</p>
                <p className="text-2xl font-bold">{courses.filter(c => c.is_published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Estudiantes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Módulos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
                <Badge 
                  variant={course.is_published ? "default" : "secondary"}
                  className="ml-2"
                >
                  {course.is_published ? 'Publicado' : 'Borrador'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Badge className={difficultyColors[course.difficulty_level]}>
                  {difficultyLabels[course.difficulty_level]}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.estimated_duration || 0} min</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>0 módulos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>0 estudiantes</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/courses/${course.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublishStatus(course.id, course.is_published)}
                >
                  {course.is_published ? <Eye className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/courses/${course.id}/analytics`)}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No se encontraron cursos' : 'No tienes cursos creados'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm 
              ? 'Intenta ajustar tu búsqueda.' 
              : 'Comienza creando tu primer curso para tus estudiantes.'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Curso
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 