'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (authData.user) {
        toast.success('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.')
        router.push('/login')
      }
    } catch (err) {
      console.error('Error during registration:', err)
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Error al crear la cuenta. Por favor, intenta de nuevo.')
      }
      toast.error('Error al crear la cuenta')
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
            Únete a nuestra comunidad educativa
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}