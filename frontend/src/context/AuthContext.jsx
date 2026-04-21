import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    const isAdmin = localStorage.getItem('is_admin') === 'true'
    if (token) setUser({ token, name, isAdmin })
  }, [])

  function login(token, name, isAdmin) {
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('is_admin', isAdmin)
    setUser({ token, name, isAdmin })
  }

  function logout() {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}