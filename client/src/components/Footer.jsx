/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight, Github, Linkedin, Twitter } from 'lucide-react'

function BrandMark({ className = 'h-7 w-7' }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id="pgF" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6A664" />
          <stop offset="1" stopColor="#B68A5D" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#pgF)" />
      <path d="M13 29.5v-9.2c0-1.2.9-2.2 2.1-2.3l5.8-.5c4.6-.4 8.1 3.3 7.7 7.6-.3 3.2-2.7 6-5.8 6.5l-7.7 1.2c-1.2.2-2.1-.7-2.1-1.8Z" fill="white" opacity=".9"/>
      <circle cx="17" cy="17.5" r="2.4" fill="white" opacity=".95" />
    </svg>
  )
}
function BrandWord({ className = 'text-base font-semibold tracking-tight' }) {
  return (
    <span className={className}>
      <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">PG</span>
      <span className="text-slate-900 dark:text-slate-100">-Life</span>
    </span>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const onSubscribe = (e) => e.preventDefault()

  return (
    <footer className="mt-10">
      {/* Slim gold accent */}
      <div className="h-px w-full bg-gradient-to-r from-brand-400/80 via-brand-500/60 to-brand-600/80" />

      {/* Compact glass surface */}
      <div className="bg-white/70 dark:bg-[#1C1A17]/70 backdrop-blur-xl border-t border-brand-100/40 dark:border-brand-900/30">
        {/* MAIN — tightened paddings & gaps */}
        <div className="container-max py-8">
          {/* Top row: brand + quick newsletter + socials (single line on md+) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
            <div className="flex items-center gap-2">
              <BrandMark />
              <BrandWord />
              <span className="hidden sm:inline text-xs text-slate-600 dark:text-text-muted pl-2">
                Premium PG stays across India
              </span>
            </div>

            {/* Inline newsletter (compact) */}
            <form onSubmit={onSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-9 w-56 sm:w-64 rounded-full bg-white/80 dark:bg-[#2A2723]/70
                           border border-slate-200 dark:border-[#2A2723]
                           px-3 text-[13px] placeholder:text-slate-400
                           focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-9 px-3 rounded-full text-sm
                           bg-gradient-to-r from-brand-400 to-brand-600 text-white
                           shadow-[0_2px_10px_rgba(182,138,93,0.25)]
                           hover:shadow-[0_4px_14px_rgba(182,138,93,0.35)]
                           transition"
              >
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Socials (compact capsules) */}
            <div className="flex items-center gap-2">
              {[{I:Twitter,l:'Twitter'},{I:Github,l:'GitHub'},{I:Linkedin,l:'LinkedIn'}].map(({I,l})=>(
                <a key={l} href="#" aria-label={l}
                   className="h-8 w-8 grid place-items-center rounded-full
                              bg-white/70 hover:bg-white
                              border border-slate-200 text-slate-700
                              dark:bg-[#1C1A17]/70 dark:hover:bg-[#2A2723] dark:text-slate-300
                              transition">
                  <I size={14}/>
                </a>
              ))}
            </div>
          </div>

          {/* Links — condensed to 3 columns, smaller type & tighter spacing */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-500 dark:text-text-muted mb-2">
                Explore
              </h4>
              <ul className="space-y-1.5 text-[14px]">
                <li><Link to="/search" className="hover:underline">Search PGs</Link></li>
                <li><Link to="/search?city=Delhi" className="hover:underline">Cities</Link></li>
                <li className="mt-2 text-[10px] uppercase tracking-wide text-slate-500 dark:text-text-muted">Rooms</li>
                <li className="flex gap-3">
                  <Link to="/search?roomType=single" className="hover:underline">Single</Link>
                  <Link to="/search?roomType=twin" className="hover:underline">Twin</Link>
                  <Link to="/search?roomType=triple" className="hover:underline">Triple</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-500 dark:text-text-muted mb-2">
                Company
              </h4>
              <ul className="space-y-1.5 text-[14px]">
                <li><Link to="/about" className="hover:underline">About us</Link></li>
                <li><Link to="/#services" className="hover:underline">Services</Link></li>
                <li><Link to="/#gallery" className="hover:underline">Gallery</Link></li>
                <li><Link to="/#contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-500 dark:text-text-muted mb-2">
                Contact
              </h4>
              <ul className="space-y-2 text-[14px]">
                <li className="flex gap-2 items-start text-slate-700 dark:text-slate-300">
                  <MapPin size={14} className="mt-0.5 text-slate-500 dark:text-text-muted" />
                  <span>PG-Life HQ, Sector 62, Noida, UP 201309</span>
                </li>
                <li className="flex gap-2 items-center text-slate-700 dark:text-slate-300">
                  <Phone size={14} className="text-slate-500 dark:text-text-muted" />
                  <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a>
                </li>
                <li className="flex gap-2 items-center text-slate-700 dark:text-slate-300">
                  <Mail size={14} className="text-slate-500 dark:text-text-muted" />
                  <a href="mailto:support@pg-life.dev" className="hover:underline">support@pg-life.dev</a>
                </li>
                {/* Owner CTA (slimmer) */}
                <li className="pt-1.5">
                  <Link
                    to="/owner"
                    className="inline-flex items-center justify-center w-full h-9 rounded-full text-[13px] font-medium
                               bg-gradient-to-r from-brand-400 to-brand-600 text-white
                               shadow-[0_2px_10px_rgba(182,138,93,0.25)] hover:shadow-[0_4px_14px_rgba(182,138,93,0.35)]
                               transition"
                  >
                    List your PG
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar — slimmer */}
          <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-[#2A2723] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px]">
            <p className="text-slate-700 dark:text-text-muted">
              © {year} PG-Life. All rights reserved.
            </p>
            <div className="flex gap-4 text-slate-700 dark:text-text-muted">
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
