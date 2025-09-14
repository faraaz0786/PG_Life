import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { forgotPassword } from '../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Enter your email')
    try {
      setLoading(true)
      await forgotPassword(email)
      toast.success('If that email exists, a reset link has been sent.')
      nav('/login')
    } catch (e) {
      // api interceptor already toasts; keep silent here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-max section grid place-items-center">
      <div className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-extrabold">Forgot password</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">We’ll email you a link to reset it.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Email</label>
            <div className="relative">
              <input className="input pl-10" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
      </div>
    </div>
  )
}
