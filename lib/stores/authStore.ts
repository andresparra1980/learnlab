import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  initialize: () => Promise<void>
  reset: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        })
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      signIn: async (email, password) => {
        const supabase = createClient()
        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          if (data.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profileError) {
              console.error('Profile fetch error:', profileError)
              // If profile doesn't exist, create it
              if (profileError.code === 'PGRST116') {
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    email: data.user.email || '',
                    first_name: data.user.user_metadata?.first_name || '',
                    last_name: data.user.user_metadata?.last_name || '',
                    role: 'student',
                  })
                  .select()
                  .single()

                if (createError) {
                  console.error('Profile creation error:', createError)
                  throw new Error('Error al crear el perfil del usuario')
                }

                set({
                  user: newProfile,
                  isAuthenticated: true,
                  loading: false,
                  error: null,
                })

                return { success: true }
              } else {
                throw new Error('Error al obtener el perfil del usuario')
              }
            }

            set({
              user: profile,
              isAuthenticated: true,
              loading: false,
              error: null,
            })

            return { success: true }
          }

          throw new Error('Error al iniciar sesión')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      signUp: async (email, password, userData) => {
        const supabase = createClient()
        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
              },
            },
          })

          if (error) throw error

          if (data.user) {
            set({ loading: false })
            return { success: true }
          }

          throw new Error('Error al crear la cuenta')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
          set({
            loading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      signOut: async () => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          })
        } catch (error) {
          console.error('Sign out error:', error)
          set({ loading: false })
        }
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return { success: false, error: 'Usuario no autenticado' }

        const supabase = createClient()
        set({ loading: true, error: null })

        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) throw error

          set({
            user: { ...user, ...updates },
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
          set({
            loading: false,
            error: errorMessage,
          })
          return { success: false, error: errorMessage }
        }
      },

      initialize: async () => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) throw error

          if (session?.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError) {
              console.error('Profile fetch error:', profileError)
              // If profile doesn't exist, create it
              if (profileError.code === 'PGRST116') {
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    first_name: session.user.user_metadata?.first_name || '',
                    last_name: session.user.user_metadata?.last_name || '',
                    role: 'student',
                  })
                  .select()
                  .single()

                if (createError) {
                  console.error('Profile creation error:', createError)
                  set({
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                    error: null,
                  })
                  return
                }

                set({
                  user: newProfile,
                  isAuthenticated: true,
                  loading: false,
                  error: null,
                })
                return
              }

              set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
              })
              return
            }

            set({
              user: profile,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          })
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Auth listener setup
if (typeof window !== 'undefined') {
  const supabase = createClient()
  
  supabase.auth.onAuthStateChange((event, session) => {
    const { setUser, initialize } = useAuthStore.getState()
    
    if (event === 'SIGNED_OUT') {
      setUser(null)
    } else if (event === 'SIGNED_IN' && session) {
      initialize()
    }
  })
}