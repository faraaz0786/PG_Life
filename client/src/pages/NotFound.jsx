// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-max section">
      <div className="mx-auto max-w-xl text-center card p-10 relative overflow-hidden">
        <div className="absolute -top-24 -left-16 h-56 w-56 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-28 -right-10 h-56 w-56 bg-fuchsia-500/10 blur-3xl rounded-full" />
        <div className="relative">
          <div className="text-7xl font-extrabold text-slate-300 dark:text-slate-700">404</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold">Page not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link to="/" className="btn btn-primary">Go Home</Link>
            <Link to="/search" className="btn">Browse PGs</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
