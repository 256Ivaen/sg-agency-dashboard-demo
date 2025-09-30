import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('jwt')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    setUser(null)
    // DON'T refresh the page - let React Router handle navigation
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  return {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAdmin: () => hasRole(['super_admin']),
    isFinanceManager: () => hasRole(['finance_manager', 'super_admin']),
    isManager: () => hasRole(['manager', 'super_admin']),
    isProjectManager: () => hasRole(['project_manager', 'manager', 'super_admin']),
    isAuthenticated: !!user
  }
}