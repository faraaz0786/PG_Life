/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu, X, Search, Heart, LayoutDashboard, PlusCircle, LogIn, UserPlus,
  Building2, ChevronDown, Sun, Moon
} from 'lucide-react'

/* ---------------- Brand mark ---------------- */
function BrandMark({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id="pgG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6A664" />
          <stop offset="1" stopColor="#B68A5D" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#pgG)" />
      <path
        d="M13 29.5v-9.2c0-1.2.9-2.2 2.1-2.3l5.8-.5c4.6-.4 8.1 3.3 7.7 7.6-.3 3.2-2.7 6-5.8 6.5l-7.7 1.2c-1.2.2-2.1-.7-2.1-1.8Z"
        fill="white"
        opacity=".9"
      />
      <circle cx="17" cy="17.5" r="2.4" fill="white" opacity=".95" />
    </svg>
  )
}

function BrandWord({ className = 'text-lg font-extrabold tracking-tight' }) {
  return (
    <span className={className}>
      <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">PG</span>
      <span className="text-slate-900 dark:text-slate-100">-Life</span>
    </span>
  )
}

/* ---------------- Avatar ---------------- */
function Avatar({ name = '' }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(' ').filter(Boolean)
    return (parts[0]?.[0] || 'U').toUpperCase() + (parts[1]?.[0] || '')
  }, [name])
  return (
    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600
                    text-white grid place-items-center text-sm font-bold shadow-md">
      {initials}
    </div>
  )
}

/* ---------------- NavItem ---------------- */
function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] transform',
          'bg-white/60 text-slate-700 hover:bg-white hover:scale-[1.03] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]',
          'dark:bg-[#1C1A17]/70 dark:text-slate-300 dark:hover:bg-[#2A2723] dark:hover:scale-[1.03]',
          'dark:hover:shadow-[0_4px_14px_rgba(198,166,100,0.1)]',
          isActive
            ? 'text-brand-700 dark:text-brand-dark ring-1 ring-brand-400/60 dark:ring-brand-dark/50 shadow-inner'
            : 'ring-0'
        ].join(' ')
      }
    >
      {children}
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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (!userMenuRef.current?.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  const goLogout = async () => {
    try { await logout?.() } finally { nav('/login') }
  }

  const OwnerCTA = () => (
    <Link
      to="/owner"
      className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium
                 bg-gradient-to-r from-brand-400 to-brand-600 text-white
                 shadow-[0_4px_14px_rgba(182,138,93,0.25)] hover:shadow-[0_6px_20px_rgba(182,138,93,0.35)]
                 hover:scale-[1.03] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                 dark:from-brand-dark dark:to-brand-700"
    >
      <PlusCircle size={16} /> Add Listing
    </Link>
  )

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-all duration-500 backdrop-blur-xl',
        isScrolled
          ? 'bg-white/70 dark:bg-[#1C1A17]/70 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]'
          : 'bg-transparent border-b border-transparent'
      ].join(' ')}
    >
      <div className="container-max h-16 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative">
            <BrandMark className="h-9 w-9 transition-transform group-hover:scale-[1.05]" />
            <div className="absolute inset-0 rounded-[14px] blur-md opacity-0 group-hover:opacity-40 bg-gradient-to-br from-brand-400/40 to-brand-600/40 transition" />
          </div>
        </Link>
        <Link to="/" className="hidden sm:block">
          <BrandWord className="text-lg font-extrabold tracking-tight" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3 ml-4">
          <NavItem to="/search"><Search size={16} /> Search</NavItem>
          <NavItem to="/search?city=Delhi">Cities</NavItem>
          {role === 'seeker' && <NavItem to="/dashboard"><LayoutDashboard size={16} /> Dashboard</NavItem>}
          {role === 'seeker' && <NavItem to="/favorites"><Heart size={16} /> Favorites</NavItem>}
          {role === 'owner' && <NavItem to="/owner"><Building2 size={16} /> Owner</NavItem>}
        </nav>

        {/* Right actions */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded-full
                       bg-white/60 hover:bg-white hover:scale-[1.05]
                       shadow-sm hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                       dark:bg-[#1C1A17]/70 dark:hover:bg-[#2A2723]
                       dark:hover:shadow-[0_4px_12px_rgba(198,166,100,0.15)]
                       transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun size={18} className="text-brand-dark" />
              : <Moon size={18} className="text-brand-600" />}
          </button>

          {role === 'owner' && <OwnerCTA />}

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium
                           bg-white/60 hover:bg-white hover:scale-[1.03]
                           border border-slate-300 shadow-sm hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                           text-slate-700 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                           dark:bg-[#1C1A17]/70 dark:border-[#2A2723]
                           dark:text-slate-300 dark:hover:bg-[#2A2723]
                           dark:hover:shadow-[0_4px_14px_rgba(198,166,100,0.12)]"
              >
                <LogIn size={16} /> Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium
                           bg-gradient-to-r from-brand-400 to-brand-600 text-white
                           shadow-[0_4px_14px_rgba(182,138,93,0.25)] hover:shadow-[0_6px_20px_rgba(182,138,93,0.35)]
                           hover:scale-[1.03] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                           dark:from-brand-dark dark:to-brand-700"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className="flex items-center gap-2"
              >
                <Avatar name={user?.name} />
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {userOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200/60 dark:border-slate-800/60
                             bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur
                             shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
                  role="menu"
                >
                  <Link
                    to={role === 'owner' ? '/owner' : '/dashboard'}
                    onClick={() => setUserOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-brand-50/50 dark:hover:bg-brand-800/30"
                  >
                    Dashboard
                  </Link>
                  {role === 'seeker' && (
                    <Link
                      to="/favorites"
                      onClick={() => setUserOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-brand-50/50 dark:hover:bg-brand-800/30"
                    >
                      Favorites
                    </Link>
                  )}
                  <button
                    onClick={goLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50/50 dark:hover:bg-brand-800/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <button className="btn h-10 px-3" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn h-10 px-3" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* 🌙 Mobile Drawer (Premium) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 transition-all">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85%]
                       bg-white/80 dark:bg-[#1C1A17]/80 backdrop-blur-2xl
                       border-l border-brand-100/40 dark:border-brand-900/30
                       shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                       p-5 flex flex-col gap-5 animate-slide-in"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark className="h-8 w-8" />
                <BrandWord className="text-base font-extrabold tracking-tight" />
              </div>
              <button
                className="h-9 w-9 flex items-center justify-center rounded-full bg-white/60 dark:bg-[#2A2723] hover:scale-[1.05] transition-all"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile nav items */}
            <nav className="mt-2 flex flex-col gap-3">
              <NavItem to="/search" onClick={() => setMobileOpen(false)}>
                <Search size={16}/> Search
              </NavItem>
              <NavItem to="/search?city=Delhi" onClick={() => setMobileOpen(false)}>
                Cities
              </NavItem>
              {role === 'seeker' && (
                <>
                  <NavItem to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={16}/> Dashboard
                  </NavItem>
                  <NavItem to="/favorites" onClick={() => setMobileOpen(false)}>
                    <Heart size={16}/> Favorites
                  </NavItem>
                </>
              )}
              {role === 'owner' && (
                <NavItem to="/owner" onClick={() => setMobileOpen(false)}>
                  <Building2 size={16}/> Owner
                </NavItem>
              )}
            </nav>

            {/* Auth buttons */}
            <div className="mt-auto flex flex-col gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium
                               bg-white/70 hover:bg-white hover:scale-[1.03]
                               border border-slate-300 shadow-sm text-slate-700
                               dark:bg-[#1C1A17]/70 dark:text-slate-300 dark:hover:bg-[#2A2723]
                               dark:hover:shadow-[0_4px_14px_rgba(198,166,100,0.12)]
                               transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <LogIn size={16}/> Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium
                               bg-gradient-to-r from-brand-400 to-brand-600 text-white
                               shadow-[0_4px_14px_rgba(182,138,93,0.25)] hover:shadow-[0_6px_20px_rgba(182,138,93,0.35)]
                               hover:scale-[1.03] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                               dark:from-brand-dark dark:to-brand-700"
                  >
                    <UserPlus size={16}/> Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); goLogout() }}
                  className="inline-flex items-center justify-center gap-2 h-10 rounded-full text-sm font-medium
                             bg-white/70 hover:bg-white hover:scale-[1.03]
                             border border-slate-300 shadow-sm text-slate-700
                             dark:bg-[#1C1A17]/70 dark:text-slate-300 dark:hover:bg-[#2A2723]
                             dark:hover:shadow-[0_4px_14px_rgba(198,166,100,0.12)]
                             transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
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
