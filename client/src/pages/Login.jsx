import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthLayout from '../components/AuthLayout'
import FieldIcon from '../components/FieldIcon'

const fieldVariants = {
  hidden: { y: 10, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.04 + i * 0.05, type: 'spring', stiffness: 160, damping: 18 }
  })
}

export default function Login() {
  const nav = useNavigate()
  const location = useLocation()
  const { login } = useAuth() || {}

  const [email, setEmail] = useState(localStorage.getItem('remember_email') || '')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(!!localStorage.getItem('remember_email'))
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (password.length < 6) e.password = 'Min 6 chars'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const doLogin = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const { data } = await api.post('/api/auth/login', { email, password })
      // Persist + hydrate context
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })

      // Remember email (optional UX)
      if (remember) localStorage.setItem('remember_email', email)
      else localStorage.removeItem('remember_email')

      toast.success('Welcome back!')
      // Redirect: ?next= has priority
      const params = new URLSearchParams(location.search)
      const next = params.get('next')
      if (next) return nav(next, { replace: true })

      // Role-based default
      const target = data.user?.role === 'owner' ? '/owner' : '/dashboard'
      nav(target, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      heroTitle="Welcome Back!"
      heroCopy="Jump back in and pick up where you left off."
      title="Login"
      subtitle={
        <span>
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand-700 dark:text-brand-400 hover:underline">
            Create your account
          </Link>
        </span>
      }
    >
      <motion.form className="auth-form space-y-3" onSubmit={doLogin} initial="hidden" animate="show">
        {/* Email */}
        <motion.div className="field" variants={fieldVariants} custom={0}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <input
              className={`input pl-12 ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              onBlur={validate}
              autoComplete="email"
            />
            <FieldIcon show={!email}><Mail className="h-5 w-5" /></FieldIcon>
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </motion.div>

        {/* Password */}
        <motion.div className="field" variants={fieldVariants} custom={1}>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              className={`input pr-10 pl-12 ${errors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onBlur={validate}
              autoComplete="current-password"
            />
            <FieldIcon show={!password}><Lock className="h-5 w-5" /></FieldIcon>
            <button
              type="button"
              className="absolute right-2 top-2.5 text-slate-500 hover:text-slate-300"
              onClick={() => setShow(s => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

          <div className="text-right mt-2">
            <Link to="/forgot" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </motion.div>

        {/* Row */}
        <motion.div className="field flex items-center justify-between" variants={fieldVariants} custom={2}>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-brand-600"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          {/* (duplicate forgot link removed) */}
        </motion.div>

        <motion.button type="submit" className="btn btn-primary w-full h-11" disabled={loading} variants={fieldVariants} custom={3}>
          {loading ? 'Signing in…' : 'Login'}
        </motion.button>

        {/* Socials (disabled placeholders) */}
        <div className="auth-social">
          <motion.div className="flex items-center gap-3 text-xs text-slate-500 mt-3" variants={fieldVariants} custom={4}>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            Or continue with
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-3 mt-3" variants={fieldVariants} custom={5}>
            <button type="button" disabled className="btn w-full">Google</button>
            <button type="button" disabled className="btn w-full">GitHub</button>
          </motion.div>
        </div>
      </motion.form>
    </AuthLayout>
  )
}
