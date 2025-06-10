export interface User {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  role: 'student' | 'teacher' | 'admin'
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  user: User | null
  session: AuthSession | null
  error?: string
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
}

export type UserRole = 'student' | 'teacher' | 'admin'

export interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>
  signUp: (credentials: RegisterCredentials) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>
}