import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="border-b bg-white">
      <div className="container-max py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">PG-Life</Link>
        <nav className="ml-auto flex items-center gap-3">
          <Link to="/search" className="btn">Search</Link>
          {user ? (
            <>
              {user.role === 'owner' ? <Link className="btn" to="/owner">Owner</Link> : <Link className="btn" to="/seeker">Dashboard</Link>}
              <button className="btn" onClick={() => { logout(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
