/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom'
import PageLoader from './PageLoader.jsx'
import { useAuth } from '../context/AuthContext'

/**
 * Usage:
 *  <Protected> ... </Protected>                  // any logged-in user
 *  <Protected role="seeker"> ... </Protected>    // only seekers
 *  <Protected role="owner"> ... </Protected>     // only owners
 */
export default function Protected({ children, role }) {
  const { user, authReady } = useAuth() || {}
  const location = useLocation()

  // ⏳ Wait until AuthContext finishes bootstrapping from localStorage
  if (!authReady) return <PageLoader />

  // Not logged in → send to login with ?next=
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  // Role mismatch → nudge to their own area
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/dashboard'} replace />
  }

  return children
}
