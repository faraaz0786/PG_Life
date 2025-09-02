import { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(()=> {
    const raw = localStorage.getItem('pg_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(()=> localStorage.getItem('pg_token') || '')

  useEffect(()=>{
    if (user) localStorage.setItem('pg_user', JSON.stringify(user))
    else localStorage.removeItem('pg_user')
  }, [user])
  useEffect(()=>{
    if (token) localStorage.setItem('pg_token', token)
    else localStorage.removeItem('pg_token')
  }, [token])

  const login = (u,t) => { setUser(u); setToken(t) }
  const logout = () => { setUser(null); setToken('') }

  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
