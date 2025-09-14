import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  email: string
  username?: string
  role: string
  created_at: string
  updated_at: string
}

// Type for session result
type GetSessionResult = {
  data: { session: Session | null }
  error: AuthError | null
}

// Type for profile result
type ProfileResult = {
  data: Profile | null
  error: any
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  authError: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // Helper function to create a timeout promise for session
  const createSessionTimeoutPromise = (ms: number): Promise<GetSessionResult> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        data: { session: null },
        error: new AuthError('Session retrieval timeout')
      }), ms)
    })
  }

  // Helper function to create a timeout promise for profile
  const createProfileTimeoutPromise = (ms: number): Promise<ProfileResult> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        data: null,
        error: new Error('Profile fetch timeout')
      }), ms)
    })
  }

  useEffect(() => {
    // Get initial session using IIFE
    (async () => {
      try {
        setAuthError(null)
        setLoading(true)
        
        // Race the session retrieval against a timeout (10 seconds)
        const sessionResult = await Promise.race([
          supabase.auth.getSession(),
          createSessionTimeoutPromise(10000)
        ])
        
        if (sessionResult.error) {
          console.error('Error getting session:', sessionResult.error)
          setAuthError(sessionResult.error.message)
          setSession(null)
          setUser(null)
          setProfile(null)
        } else {
          const { session } = sessionResult.data
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        
        // Check if it's a timeout error
        if (error instanceof Error && error.message.includes('timeout')) {
          console.warn('Session retrieval timed out, redirecting to login')
          setAuthError('Session validation timed out. Please sign in again.')
        } else {
          setAuthError('Failed to initialize session')
        }
        
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setAuthError(null)
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setAuthError('Authentication state change failed')
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      }
    )


    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      // Add timeout for profile fetching as well
      const profileResult = await Promise.race([
        supabase
          .from('profiles')
          .select('id, email, username, role, created_at, updated_at')
          .eq('id', userId)
          .single(),
        createProfileTimeoutPromise(5000)
      ])

      if (profileResult.error) {
        if (profileResult.error.code === 'PGRST116') {
          // No profile found - this is okay, user might not have a profile yet
          console.log('No profile found for user:', userId)
          setProfile(null)
          return
        }
        console.error('Error fetching profile:', profileResult.error)
        return
      }

      if (profileResult.data) {
        setProfile(profileResult.data)
      } else {
        setProfile(null)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        console.warn('Profile fetch timed out')
      } else {
        console.error('Error fetching profile:', error)
      }
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setAuthError(error.message)
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing in:', error)
      setAuthError('Sign in failed')
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      setAuthError(null)
    } catch (error) {
      console.error('Error signing out:', error)
      setAuthError('Sign out failed')
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    authError,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}