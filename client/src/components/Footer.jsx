/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import {
  Mail, Phone, MapPin, ArrowRight, Github, Linkedin, Twitter
} from 'lucide-react'

/* Brand mark (matches header’s gradient vibe) */
function BrandMark({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id="pgF" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#pgF)" />
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

export default function Footer() {
  const year = new Date().getFullYear()

  const onSubscribe = (e) => {
    e.preventDefault()
    // no-op: wire up later if needed
  }

  return (
    <footer className="mt-16">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/70 via-cyan-400/70 to-indigo-500/70" />

      <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur border-t border-slate-200/60 dark:border-slate-800/60">
        {/* Main */}
        <div className="container-max py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand + mission + newsletter */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <BrandMark />
                <BrandWord />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Discover thoughtfully curated PG stays across India. Compare by budget,
                amenities & gender policy—then book visits in a tap.
              </p>

              <form onSubmit={onSubscribe} className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Subscribe for updates & offers
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input flex-1"
                    aria-label="Email address"
                  />
                  <button className="btn btn-primary h-11 px-4" type="submit" aria-label="Subscribe">
                    <ArrowRight size={16} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>

              {/* Socials */}
              <div className="flex items-center gap-2 pt-1">
                <a href="#" className="btn h-9 w-9 p-0 rounded-xl" aria-label="Twitter">
                  <Twitter size={16} />
                </a>
                <a href="#" className="btn h-9 w-9 p-0 rounded-xl" aria-label="GitHub">
                  <Github size={16} />
                </a>
                <a href="#" className="btn h-9 w-9 p-0 rounded-xl" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3">
                Explore
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/search" className="hover:underline">Search PGs</Link></li>
                <li><Link to="/search?city=Delhi" className="hover:underline">Cities</Link></li>
                <li className="mt-1 text-xs uppercase text-slate-500 dark:text-slate-400">Rooms</li>
                <li className="flex gap-3 text-sm">
                  <Link to="/search?roomType=single" className="hover:underline">Single</Link>
                  <Link to="/search?roomType=twin" className="hover:underline">Twin</Link>
                  <Link to="/search?roomType=triple" className="hover:underline">Triple</Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:underline">About us</Link></li>
                <li><Link to="/#services" className="hover:underline">Services</Link></li>
                <li><Link to="/#gallery" className="hover:underline">Gallery</Link></li>
                <li><Link to="/#contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-3">
                Contact
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2 items-start">
                  <MapPin size={16} className="mt-0.5 text-slate-500" />
                  <span>PG-Life HQ, Sector 62, Noida, UP 201309</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone size={16} className="text-slate-500" />
                  <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail size={16} className="text-slate-500" />
                  <a href="mailto:support@pg-life.dev" className="hover:underline">support@pg-life.dev</a>
                </li>
              </ul>

              {/* Owner CTA */}
              <div className="mt-4">
                <Link to="/owner" className="btn w-full">
                  List your PG
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-10" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              © {year} PG-Life. All rights reserved.
            </p>
            <div className="flex gap-4 text-slate-600 dark:text-slate-300">
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <Link to="/cookies" className="hover:underline">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
