import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Eye, EyeOff, Building2, Users, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

import { googlePopup, sendOtpToPhone, ensureRecaptcha } from '../services/firebase'

const fieldVariants = {
  hidden: { y: 10, opacity: 0 },
  show: (i = 0) => ({
    y: 0, opacity: 1,
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

  // Phone OTP
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const confirmRef = useRef(null)

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
      const { data } = await api.post('/api/auth/signup', { name, email, password, role })
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })
      toast.success('Account created!')
      const target = data.user?.role === 'owner' ? '/owner' : '/dashboard'
      nav(target, { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  // ---- Social / Phone handlers ----
  async function googleRegister() {
    try {
      const { idToken } = await googlePopup()
      const { data } = await api.post('/api/auth/firebase', { idToken, provider: 'google', role })
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })
      toast.success('Signed up with Google')
      nav(data.user?.role === 'owner' ? '/owner' : '/dashboard', { replace: true })
    } catch (e) {
      console.error(e)
      toast.error('Google sign-in failed')
    }
  }

  async function startPhoneSignup() {
    try {
      ensureRecaptcha()
      if (!/^\+\d{10,15}$/.test(phone)) {
        toast.error('Enter phone as +91XXXXXXXXXX')
        return
      }
      const conf = await sendOtpToPhone(phone)
      confirmRef.current = conf
      setOtpSent(true)
      toast.success('OTP sent')
    } catch (e) {
      console.error(e)
      toast.error('Failed to send OTP')
    }
  }

  async function confirmOtpRegister() {
    try {
      const result = await confirmRef.current.confirm(otpCode)
      const idToken = await result.user.getIdToken()
      const { data } = await api.post('/api/auth/firebase', { idToken, provider: 'phone', role })
      localStorage.setItem('token', data.token)
      login?.({ token: data.token, user: data.user })
      toast.success('Phone verified')
      nav(data.user?.role === 'owner' ? '/owner' : '/dashboard', { replace: true })
    } catch (e) {
      console.error(e)
      toast.error('Invalid OTP')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand/10 via-amber-50 to-stone-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* ✨ Animated background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-indigo-400/30 dark:bg-indigo-700/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-card p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brand mb-1">Create your account</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Already a member?{' '}
            <Link to="/login" className="text-brand hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>

        <motion.form onSubmit={doRegister} className="space-y-4" initial="hidden" animate="show">
          {/* Full Name */}
          <motion.div className="field" variants={fieldVariants} custom={0}>
            <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2">
              <User size={18} className="text-brand shrink-0" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </motion.div>

          {/* Email */}
          <motion.div className="field" variants={fieldVariants} custom={1}>
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
          <motion.div className="field" variants={fieldVariants} custom={2}>
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
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </motion.div>

          {/* Confirm Password */}
          <motion.div className="field" variants={fieldVariants} custom={3}>
            <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-2">
              <Lock size={18} className="text-brand shrink-0" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
          </motion.div>

          {/* Role */}
          <motion.div className="field" variants={fieldVariants} custom={4}>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                  role === 'seeker'
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-brand/10 text-brand hover:bg-brand/20'
                }`}
              >
                <Users size={16} className="inline mr-1" /> Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                  role === 'owner'
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-brand/10 text-brand hover:bg-brand/20'
                }`}
              >
                <Building2 size={16} className="inline mr-1" /> Owner
              </button>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div className="field flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300" variants={fieldVariants} custom={5}>
            <input
              type="checkbox"
              className="accent-brand"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-brand hover:underline">
                Terms
              </a>{' '}
              &{' '}
              <a href="#" className="text-brand hover:underline">
                Privacy
              </a>
            </span>
          </motion.div>
          {errors.agree && <p className="text-xs text-red-500 -mt-2">{errors.agree}</p>}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            variants={fieldVariants}
            custom={6}
            className="w-full py-2.5 rounded-xl bg-brand text-white font-semibold shadow-md hover:bg-brand-dark transition"
          >
            {loading ? 'Creating account…' : <><UserPlus className="inline mr-1" size={18} /> Sign Up</>}
          </motion.button>

          {/* Divider */}
          <motion.div className="flex items-center gap-3 text-xs text-slate-500 mt-3" variants={fieldVariants} custom={7}>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            Or continue with
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </motion.div>

          {/* Social / Phone */}
          <motion.div className="grid grid-cols-2 gap-3 mt-3" variants={fieldVariants} custom={8}>
            <button type="button" onClick={googleRegister} className="btn w-full">Google</button>

            {!otpSent ? (
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="+91XXXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <button type="button" onClick={startPhoneSignup} className="btn">Send OTP</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                />
                <button type="button" onClick={confirmOtpRegister} className="btn btn-primary">Verify</button>
              </div>
            )}
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}
