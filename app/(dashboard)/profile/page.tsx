'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Mail,
  Calendar,
  Trophy,
  BookOpen,
  Clock,
  Target,
  Star,
  Edit,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface ProfileStats {
  coursesCompleted: number
  totalLessons: number
  studyTime: number
  achievements: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
  averageScore: number
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })
  const [stats] = useState<ProfileStats>({
    coursesCompleted: 3,
    totalLessons: 28,
    studyTime: 67,
    achievements: 12,
    currentStreak: 7,
    longestStreak: 15,
    totalPoints: 1250,
    averageScore: 87
  })

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const result = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name
      })

      if (result.success) {
        setIsEditing(false)
        toast.success('Perfil actualizado correctamente')
      } else {
        toast.error('Error al actualizar el perfil')
      }
    } catch {
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Gestiona tu información personal y revisa tu progreso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={loading} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nombre completo
                    </Label>
                    <p className="text-lg font-medium">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : 'No especificado'
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rol
                    </Label>
                    <div>
                      <Badge variant="secondary">
                        {user.role === 'student' ? 'Estudiante' : 
                         user.role === 'teacher' ? 'Profesor' : 'Administrador'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Miembro desde
                    </Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {memberSince}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resumen Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Nivel actual</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Nivel 5
                </Badge>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso al siguiente nivel</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="text-center pt-2">
                <p className="text-2xl font-bold text-blue-600">{stats.totalPoints}</p>
                <p className="text-sm text-gray-500">Puntos totales</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Estadísticas de Aprendizaje
              </CardTitle>
              <CardDescription>
                Tu progreso y logros en LearnLab
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">{stats.coursesCompleted}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cursos completados</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold">{stats.totalLessons}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Lecciones completadas</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-semibold">{stats.studyTime}h</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tiempo de estudio</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="font-semibold">{stats.achievements}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Logros obtenidos</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-semibold">{stats.currentStreak} días</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Racha actual</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold">{stats.longestStreak} días</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Racha más larga</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-8 w-8 text-teal-600" />
                      <div>
                        <p className="font-semibold">{stats.averageScore}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Puntuación promedio</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="font-semibold">{stats.totalPoints}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Puntos totales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Tus últimas actividades en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Logro desbloqueado: &quot;Estudiante Dedicado&quot;</p>
                    <p className="text-sm text-gray-500">Hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Completaste &quot;Introducción a la Fotosíntesis&quot;</p>
                    <p className="text-sm text-gray-500">Hace 1 día</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Obtuviste 100% en el quiz de Biología</p>
                    <p className="text-sm text-gray-500">Hace 2 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}