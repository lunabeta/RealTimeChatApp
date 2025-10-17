import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getMe, loginRequest, logoutRequest, registerRequest, refreshRequest } from "../services/auth"

export type AuthUser = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  status?: string | null
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  googleLoginUrl: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    try {
      await refreshRequest()
      const me = await getMe()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest(email, password)
    const me = await getMe()
    setUser(me)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerRequest(name, email, password)
    const me = await getMe()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const googleLoginUrl = useMemo(() => "/api/auth/google", [])

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    googleLoginUrl,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


