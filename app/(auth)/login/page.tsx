'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface LoginData {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (data: LoginData) => {
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        throw signInError
      }

      toast.success('¡Bienvenido de vuelta!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Error during login:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
      }
      toast.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            LearnLab
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tu plataforma educativa gamificada
          </p>
        </div>
        
        <LoginForm 
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            ¿Eres profesor?{' '}
            <a
              href="/register-teacher"
              className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
            >
              Regístrate como profesor
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}