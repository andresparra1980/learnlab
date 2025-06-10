'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Save,
  Plus,
  Edit,
  BookOpen,
  Target,
  Play,
  FileText,
  Eye,
  Settings,
  Users
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

interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  is_published: boolean
  unlock_requirements: unknown
  created_at: string
  updated_at: string
}

interface NewModuleData {
  title: string
  description: string
}

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
}

export default function CourseEditPage({ params }: { params: { courseId: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [createModuleDialogOpen, setCreateModuleDialogOpen] = useState(false)
  const [newModule, setNewModule] = useState<NewModuleData>({
    title: '',
    description: ''
  })
  const [creatingModule, setCreatingModule] = useState(false)

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', params.courseId)
        .order('order_index', { ascending: true })

      if (modulesError) throw modulesError
      setModules(modulesData || [])

    } catch (error) {
      console.error('Error fetching course data:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información del curso',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [params.courseId, supabase, toast])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  const handleSaveCourse = async () => {
    if (!course) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          description: course.description,
          difficulty_level: course.difficulty_level,
          estimated_duration: course.estimated_duration
        })
        .eq('id', course.id)

      if (error) throw error

      toast({
        title: 'Éxito',
        description: 'Curso actualizado correctamente'
      })
    } catch (error) {
      console.error('Error saving course:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el curso',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCreateModule = async () => {
    if (!newModule.title.trim() || !course) {
      toast({
        title: 'Error',
        description: 'El título del módulo es requerido',
        variant: 'destructive'
      })
      return
    }

    try {
      setCreatingModule(true)
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: newModule.title,
          description: newModule.description,
          order_index: modules.length + 1
        })
        .select()
        .single()

      if (error) throw error

      setModules(prev => [...prev, data])
      setCreateModuleDialogOpen(false)
      setNewModule({ title: '', description: '' })
      
      toast({
        title: 'Éxito',
        description: 'Módulo creado correctamente'
      })
    } catch (error) {
      console.error('Error creating module:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el módulo',
        variant: 'destructive'
      })
    } finally {
      setCreatingModule(false)
    }
  }

  const toggleCoursePublishStatus = async () => {
    if (!course) return

    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !course.is_published })
        .eq('id', course.id)

      if (error) throw error

      setCourse(prev => prev ? { ...prev, is_published: !prev.is_published } : null)

      toast({
        title: 'Éxito',
        description: `Curso ${!course.is_published ? 'publicado' : 'despublicado'} correctamente`
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Curso no encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          El curso que buscas no existe o no tienes permisos para verlo.
        </p>
        <Button onClick={() => router.push('/admin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Cursos
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/courses')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={course.is_published ? "default" : "secondary"}>
                {course.is_published ? 'Publicado' : 'Borrador'}
              </Badge>
              <Badge variant="outline">
                {difficultyLabels[course.difficulty_level]}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleCoursePublishStatus}>
            {course.is_published ? <Eye className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {course.is_published ? 'Despublicar' : 'Publicar'}
          </Button>
          <Button onClick={handleSaveCourse} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="modules">Módulos y Lecciones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Curso</CardTitle>
              <CardDescription>
                Configura los detalles básicos de tu curso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={course.title}
                  onChange={(e) => setCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={course.description || ''}
                  onChange={(e) => setCourse(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                  <Select 
                    value={course.difficulty_level} 
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setCourse(prev => prev ? { ...prev, difficulty_level: value } : null)
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
                    value={course.estimated_duration || ''}
                    onChange={(e) => setCourse(prev => prev ? { ...prev, estimated_duration: parseInt(e.target.value) || null } : null)}
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Módulos del Curso</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Organiza tu contenido en módulos y lecciones
              </p>
            </div>
            
            <Dialog open={createModuleDialogOpen} onOpenChange={setCreateModuleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Módulo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Módulo</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo módulo a tu curso
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="moduleTitle">Título del Módulo</Label>
                    <Input
                      id="moduleTitle"
                      value={newModule.title}
                      onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: Introducción a la Biología"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="moduleDescription">Descripción</Label>
                    <Textarea
                      id="moduleDescription"
                      value={newModule.description}
                      onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe qué aprenderán en este módulo..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateModule} disabled={creatingModule} className="flex-1">
                      {creatingModule ? 'Creando...' : 'Crear Módulo'}
                    </Button>
                    <Button variant="outline" onClick={() => setCreateModuleDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay módulos creados
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Comienza creando el primer módulo de tu curso.
                </p>
                <Button onClick={() => setCreateModuleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Módulo
                </Button>
              </div>
            ) : (
              modules.map((module, index) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          {module.title}
                        </CardTitle>
                        <CardDescription>
                          {module.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={module.is_published ? "default" : "secondary"}>
                          {module.is_published ? 'Publicado' : 'Borrador'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>0 lecciones</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>0 estudiantes</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/courses/${course.id}/modules/${module.id}`)}
                      >
                        Ver Lecciones
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics del Curso</CardTitle>
              <CardDescription>
                Estadísticas y métricas de tu curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics próximamente
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Estamos trabajando en las estadísticas detalladas de tu curso.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 