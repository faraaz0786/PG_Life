import { useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

import { googlePopup, sendOtpToPhone, ensureRecaptcha } from '../services/firebase'

const fieldVariants = {
  hidden: { y: 10, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.05 + i * 0.06, type: 'spring', stiffness: 160, damping: 18 },
  }),
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

  // Phone OTP
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const confirmRef = useRef(null)

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
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })

      if (remember) localStorage.setItem('remember_email', email)
      else localStorage.removeItem('remember_email')

      toast.success('Welcome back!')

      const params = new URLSearchParams(location.search)
      const next = params.get('next')
      if (next) return nav(next, { replace: true })

      const target = data.user?.role === 'owner' ? '/owner' : '/dashboard'
      nav(target, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // ---- Social / Phone handlers ----
  async function loginWithGoogle() {
    try {
      const { idToken } = await googlePopup()
      const { data } = await api.post('/api/auth/firebase', { idToken, provider: 'google' })
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })
      toast.success('Signed in with Google')
      nav(data.user?.role === 'owner' ? '/owner' : '/dashboard', { replace: true })
    } catch (e) {
      console.error(e)
      toast.error('Google sign-in failed')
    }
  }

  async function startPhoneLogin() {
    try {
      ensureRecaptcha()
      if (!/^\+\d{10,15}$/.test(phone)) {
        toast.error('Enter phone as +91XXXXXXXXXX')
        return
      }
      const confirmation = await sendOtpToPhone(phone)
      confirmRef.current = confirmation
      setOtpSent(true)
      toast.success('OTP sent')
    } catch (e) {
      console.error(e)
      toast.error('Failed to send OTP')
    }
  }

  async function confirmOtp() {
    try {
      const result = await confirmRef.current.confirm(otpCode)
      const idToken = await result.user.getIdToken()
      const { data } = await api.post('/api/auth/firebase', { idToken, provider: 'phone' })
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })
      toast.success('Signed in with Phone')
      nav(data.user?.role === 'owner' ? '/owner' : '/dashboard', { replace: true })
    } catch (e) {
      console.error(e)
      toast.error('Invalid OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand/10 via-amber-50 to-stone-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated gradient glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-indigo-400/30 dark:bg-indigo-700/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-card p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brand mb-1">Welcome Back!</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Don’t have an account?{' '}
            <Link to="/register" className="text-brand hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        <motion.form className="space-y-4" onSubmit={doLogin} initial="hidden" animate="show">
          {/* Email */}
          <motion.div variants={fieldVariants} custom={0}>
            <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2">
              <Mail size={18} className="text-brand shrink-0" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={fieldVariants} custom={1}>
            <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2">
              <Lock size={18} className="text-brand shrink-0" />
              <input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-slate-700 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-slate-500 hover:text-slate-300"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

            <div className="text-right mt-2">
              <Link to="/forgot" className="text-sm text-brand hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          </motion.div>

          {/* Remember Me */}
          <motion.div variants={fieldVariants} custom={2} className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-brand"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variants={fieldVariants}
            custom={3}
            className="w-full py-2.5 rounded-xl bg-brand text-white font-semibold shadow-md hover:bg-brand-dark transition"
          >
            {loading ? 'Signing in…' : <><LogIn className="inline mr-1" size={18} /> Login</>}
          </motion.button>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 text-xs text-slate-500 mt-3" variants={fieldVariants} custom={4}>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            Or continue with
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </motion.div>

          {/* Social / Phone */}
          <motion.div className="grid gap-3 mt-3" variants={fieldVariants} custom={5}>
            <button type="button" onClick={loginWithGoogle} className="btn w-full">Sign in with Google</button>

            {!otpSent ? (
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="col-span-2 input"
                  placeholder="+91XXXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <button type="button" onClick={startPhoneLogin} className="btn">Send OTP</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="col-span-2 input"
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                />
                <button type="button" onClick={confirmOtp} className="btn btn-primary">Verify</button>
              </div>
            )}
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}
