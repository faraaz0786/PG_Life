import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Eye, EyeOff, Building2, Users } from 'lucide-react'
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

export default function Register() {
  const nav = useNavigate()
  const { login } = useAuth() || {}

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [role, setRole] = useState('seeker')
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (password.length < 6) e.password = 'Min 6 chars'
    if (confirm !== password) e.confirm = 'Passwords do not match'
    if (!agree) e.agree = 'Accept Terms & Privacy'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const doRegister = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      // Create the user
      const { data } = await api.post('/api/auth/signup', { name, email, password, role })
      // Auto-login after signup for smoother UX
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })

      toast.success('Account created!')
      // Role-based landing after signup
      const target = data.user?.role === 'owner' ? '/owner' : '/dashboard'
      nav(target, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      heroTitle="Welcome"
      heroCopy="Create your account and start exploring PGs tailored to your budget and preferences."
      title="Create your account"
      subtitle={
        <span>
          Already a member?{' '}
          <Link to="/login" className="text-brand-700 dark:text-brand-400 hover:underline">
            Login
          </Link>
        </span>
      }
    >
      <motion.form className="auth-form space-y-3" onSubmit={doRegister} initial="hidden" animate="show">
        {/* Name */}
        <motion.div className="field" variants={fieldVariants} custom={0}>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <div className="relative">
            <input
              className={`input pl-12 ${errors.name ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              placeholder="Alex Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={validate}
              autoComplete="name"
            />
            <FieldIcon show={!name}><User className="h-5 w-5" /></FieldIcon>
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </motion.div>

        {/* Email */}
        <motion.div className="field" variants={fieldVariants} custom={1}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <input
              className={`input pl-12 ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={validate}
              autoComplete="email"
            />
            <FieldIcon show={!email}><Mail className="h-5 w-5" /></FieldIcon>
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </motion.div>

        {/* Password */}
        <motion.div className="field" variants={fieldVariants} custom={2}>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              className={`input pr-10 pl-12 ${errors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              type={show ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={validate}
              autoComplete="new-password"
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
          <p className="hint text-[11px] text-slate-500 mt-1">Use at least 6 characters.</p>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </motion.div>

        {/* Confirm */}
        <motion.div className="field" variants={fieldVariants} custom={3}>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <div className="relative">
            <input
              className={`input pl-12 ${errors.confirm ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
              type="password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onBlur={validate}
              autoComplete="new-password"
            />
            <FieldIcon show={!confirm}><Lock className="h-5 w-5" /></FieldIcon>
          </div>
          {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
        </motion.div>

        {/* Role pills */}
        <motion.div className="field" variants={fieldVariants} custom={4}>
          <label className="block text-sm font-medium mb-1">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`btn ${role === 'seeker' ? 'btn-primary' : ''}`}
              onClick={() => setRole('seeker')}
            >
              <Users size={16} /> Seeker
            </button>
            <button
              type="button"
              className={`btn ${role === 'owner' ? 'btn-primary' : ''}`}
              onClick={() => setRole('owner')}
            >
              <Building2 size={16} /> Owner
            </button>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.label className="field flex items-center gap-2 text-sm" variants={fieldVariants} custom={5}>
          <input
            type="checkbox"
            className="accent-brand-600"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
          />
          I agree to the <a className="underline decoration-dotted" href="#">Terms</a> &{' '}
          <a className="underline decoration-dotted" href="#">Privacy</a>
        </motion.label>
        {errors.agree && <p className="text-xs text-red-500 -mt-2">{errors.agree}</p>}

        <motion.button type="submit" className="btn btn-primary w-full h-11" disabled={loading} variants={fieldVariants} custom={6}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </motion.button>

        {/* Socials (disabled placeholders) */}
        <div className="auth-social">
          <motion.div className="flex items-center gap-3 text-xs text-slate-500 mt-3" variants={fieldVariants} custom={7}>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            Or continue with
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-3 mt-3" variants={fieldVariants} custom={8}>
            <button type="button" disabled className="btn w-full">Google</button>
            <button type="button" disabled className="btn w-full">GitHub</button>
          </motion.div>
        </div>
      </motion.form>
    </AuthLayout>
  )
}
