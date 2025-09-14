import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPassword } from '../services/auth'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Passwords do not match')
    try {
      setLoading(true)
      await resetPassword({ token, password })
      toast.success('Password changed. Please log in.')
      nav('/login')
    } catch (e) {
      // interceptor toasts
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-max section grid place-items-center">
      <div className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-extrabold">Set a new password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">New password</label>
            <div className="relative">
              <input className="input pl-10" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Confirm password</label>
            <div className="relative">
              <input className="input pl-10" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Saving…' : 'Reset password'}</button>
        </form>
      </div>
    </div>
  )
}
