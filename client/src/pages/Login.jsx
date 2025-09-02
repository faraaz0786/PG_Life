import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('seeker1@example.com')
  const [password, setPassword] = useState('seeker123')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try {
      const { token, user } = await loginApi({ email, password })
      login(user, token)
      nav('/')
    } catch (e) {
      alert('Login failed')
    }
  }

  return (
    <div className="container-max py-10 grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-600">Login to continue</p>
      </div>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Login</button>
        <div className="text-sm text-center">No account? <Link className="text-indigo-600" to="/register">Create one</Link></div>
      </form>
    </div>
  )
}
