import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seeker')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try {
      const { token, user } = await signup({ name, email, password, role })
      login(user, token)
      nav('/')
    } catch (e) {
      alert('Signup failed')
    }
  }

  return (
    <div className="container-max py-10 grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-gray-600">Join PG-Life as a seeker or owner</p>
      </div>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="seeker">Seeker</option>
          <option value="owner">Owner</option>
        </select>
        <button className="btn btn-primary w-full">Sign up</button>
        <div className="text-sm text-center">Have an account? <Link className="text-indigo-600" to="/login">Login</Link></div>
      </form>
    </div>
  )
}
