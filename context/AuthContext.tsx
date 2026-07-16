'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  uid: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User, token: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      // localStorage corrompu ou invalide -> on repart propre
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      // ---- LA CORRECTION CLÉ ----
      // setLoading(false) est maintenant dans un `finally`,
      // donc il s'exécute TOUJOURS, même si le JSON.parse plante.
      setLoading(false)
    }
  }, [])

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}