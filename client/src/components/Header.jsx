/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu, X, Search, Heart, LayoutDashboard, PlusCircle, LogIn, UserPlus,
  Building2, ChevronDown, Sun, Moon
} from 'lucide-react'

/* ---------------- Brand mark (inline SVG) ---------------- */
function BrandMark({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id="pgG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#pgG)" />
      <path
        d="M13 29.5v-9.2c0-1.2.9-2.2 2.1-2.3l5.8-.5c4.6-.4 8.1 3.3 7.7 7.6-.3 3.2-2.7 6-5.8 6.5l-7.7 1.2c-1.2.2-2.1-.7-2.1-1.8Z"
        fill="white" opacity=".9"
      />
      <circle cx="17" cy="17.5" r="2.4" fill="white" opacity=".95" />
    </svg>
  )
}

function BrandWord({ className = 'text-lg font-extrabold tracking-tight' }) {
  return (
    <span className={className}>
      <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">PG</span>
      <span className="text-slate-900 dark:text-slate-100">-Life</span>
    </span>
  )
}

/* ---------------- Small bits ---------------- */
function Avatar({ name = '' }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ').filter(Boolean)
    return (parts[0]?.[0] || 'U').toUpperCase() + (parts[1]?.[0] || '')
  }, [name])
  return (
    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400
                    text-white grid place-items-center text-sm font-bold shadow-md">
      {initials}
    </div>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'relative px-3 py-2 rounded-md text-sm font-medium transition',
          'hover:text-slate-900 hover:bg-white/50 dark:hover:text-white dark:hover:bg-slate-800/60',
          isActive
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-700 dark:text-slate-300'
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span className="inline-flex items-center gap-2">{children}</span>
          {/* Active underline */}
          <span
            className={[
              'pointer-events-none absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full transition-all',
              isActive ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-100' : 'opacity-0'
            ].join(' ')}
          />
        </>
      )}
    </NavLink>
  )
}

/* ---------------- Header ---------------- */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  const userMenuRef = useRef(null)
  const { user, logout } = useAuth() || {}
  const nav = useNavigate()
  const role = user?.role

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu on outside click / Esc
  useEffect(() => {
    function onDocClick(e) {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(e.target)) setUserOpen(false)
    }
    function onEsc(e) { if (e.key === 'Escape') setUserOpen(false) }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const goLogout = async () => {
    try { await logout?.() } finally { nav('/login') }
  }

  const OwnerCTA = () => (
    <Link to="/owner" className="btn btn-primary h-10 px-4">
      <PlusCircle size={16} /> Add Listing
    </Link>
  )

  return (
    <header
      className={[
        'sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60',
        'backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70',
        !isScrolled ? 'shadow-none' : 'shadow-[0_6px_24px_-12px_rgba(15,23,42,0.25)]'
      ].join(' ')}
      role="banner"
    >
      <div className="container-max h-16 flex items-center gap-3">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative">
            <BrandMark className="h-9 w-9 transition-transform group-hover:scale-[1.03]" />
            {/* Subtle glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[14px] blur-md opacity-0 group-hover:opacity-40
                            bg-gradient-to-br from-indigo-500/40 to-cyan-400/40 transition" />
          </div>
        </Link>
        <Link to="/" className="hidden sm:block">
          <BrandWord className="text-lg font-extrabold tracking-tight" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavItem to="/search"><Search size={16} /> Search</NavItem>
          <NavItem to="/search?city=Delhi">Cities</NavItem>
          {role === 'seeker' && <NavItem to="/dashboard"><LayoutDashboard size={16} /> Dashboard</NavItem>}
          {role === 'seeker' && <NavItem to="/favorites"><Heart size={16} /> Favorites</NavItem>}
          {role === 'owner'  && <NavItem to="/owner"><Building2 size={16} /> Owner</NavItem>}
        </nav>

        {/* Right (desktop) */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn h-10 px-3"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

          {role === 'owner' && <OwnerCTA />}

          {!user ? (
            <>
              <Link to="/login" className="btn h-10 px-4"><LogIn size={16}/> Login</Link>
              <Link to="/register" className="btn btn-primary h-10 px-4"><UserPlus size={16}/> Sign Up</Link>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className="flex items-center gap-2 focus:outline-none"
              >
                <Avatar name={user?.name} />
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold leading-4 text-slate-900 dark:text-slate-100">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{role}</div>
                </div>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {/* Dropdown */}
              {userOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border
                             border-slate-200/60 dark:border-slate-800/60
                             bg-white/95 dark:bg-slate-900/95 backdrop-blur
                             shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
                  role="menu"
                >
                  <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    My Account
                  </div>
                  <Link
                    to={role === 'owner' ? '/owner' : '/dashboard'}
                    onClick={() => setUserOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  {role === 'seeker' && (
                    <Link
                      to="/favorites"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      role="menuitem"
                    >
                      Favorites
                    </Link>
                  )}
                  {role === 'owner' && (
                    <Link
                      to="/owner"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      role="menuitem"
                    >
                      My Listings
                    </Link>
                  )}
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                  <button
                    onClick={goLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggler */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <button
            className="btn h-10 px-3"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
          <button className="btn h-10 px-3" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%]
                          bg-white/95 dark:bg-slate-900/95 backdrop-blur
                          border-l border-slate-200/60 dark:border-slate-800/60
                          p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark className="h-8 w-8" />
                <BrandWord className="text-base font-extrabold tracking-tight" />
              </div>
              <button className="btn h-9 px-3" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            <nav className="mt-2 flex flex-col gap-1">
              <NavLink onClick={() => setMobileOpen(false)} to="/search" className="btn justify-start h-10">
                <Search size={16}/> Search
              </NavLink>
              <NavLink onClick={() => setMobileOpen(false)} to="/search?city=Delhi" className="btn justify-start h-10">
                Cities
              </NavLink>
              {role === 'seeker' && (
                <>
                  <NavLink onClick={() => setMobileOpen(false)} to="/dashboard" className="btn justify-start h-10">
                    <LayoutDashboard size={16}/> Dashboard
                  </NavLink>
                  <NavLink onClick={() => setMobileOpen(false)} to="/favorites" className="btn justify-start h-10">
                    <Heart size={16}/> Favorites
                  </NavLink>
                </>
              )}
              {role === 'owner' && (
                <NavLink onClick={() => setMobileOpen(false)} to="/owner" className="btn justify-start h-10">
                  <Building2 size={16}/> Owner
                </NavLink>
              )}
            </nav>

            <div className="mt-auto flex flex-col gap-2">
              {role === 'owner' && <OwnerCTA />}
              {!user ? (
                <>
                  <Link onClick={() => setMobileOpen(false)} to="/login" className="btn h-10">
                    <LogIn size={16}/> Login
                  </Link>
                  <Link onClick={() => setMobileOpen(false)} to="/register" className="btn btn-primary h-10">
                    <UserPlus size={16}/> Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); goLogout() }}
                  className="btn h-10"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
