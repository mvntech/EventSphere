import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { TOKEN_KEY } from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // `loading` covers the initial token check, so guarded routes don't redirect too early. With no stored token there is nothing to check and we start ready.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }, [])

  const login = useCallback(
    async (email, password) => {
      const res = await api.post('/auth/login', { email, password })
      return persist(res.data)
    },
    [persist]
  )

  const register = useCallback(
    async (details) => {
      const res = await api.post('/auth/register', details)
      return persist(res.data)
    },
    [persist]
  )

  const resetPassword = useCallback(
    async (token, password) => {
      const res = await api.post(`/auth/reset-password/${token}`, { password })
      return persist(res.data)
    },
    [persist]
  )

  const forgotPassword = useCallback(async (email) => {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
