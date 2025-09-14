/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'

// Tiny local image helper (no external deps)
function Img({ src, alt = '', className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  )
}

/**
 * CityCard
 * Props:
 *  - city: string (required)
 *  - image: string (hero image URL)
 *  - count?: number (optional, shows "24+ PGs")
 */
export default function CityCard({ city = '', image, count }) {
  const href = `/search?city=${encodeURIComponent(city)}`
  const label = typeof count === 'number' ? `${count}+ PGs` : 'Explore'

  return (
    <Link to={href} className="group block">
      <div className="card overflow-hidden p-0 relative h-40 md:h-48">
        {/* Cover */}
        <div className="absolute inset-0">
          <Img
            src={
              image ||
              'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'
            }
            alt={`PGs in ${city}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {/* subtle gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full p-4 flex flex-col justify-end">
          <div className="flex items-center gap-2 text-white drop-shadow">
            <MapPin size={18} className="opacity-90" />
            <h3 className="text-lg md:text-xl font-semibold leading-none">
              {city}
            </h3>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="badge !bg-white/90 !text-slate-900 !backdrop-blur">
              {label}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-white/90 text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
              View
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
