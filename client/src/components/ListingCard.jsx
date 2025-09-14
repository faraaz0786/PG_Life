/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { MapPin, IndianRupee, Star } from 'lucide-react'

// Tiny local image component so we don't depend on any other files
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

function formatINR(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return String(n ?? '')
  try {
    return num.toLocaleString('en-IN')
  } catch {
    return String(num)
  }
}

function titleCase(str = '') {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function ListingCard({ item = {} }) {
  const {
    _id = '',
    title = 'PG Listing',
    description = '',
    city = '',
    price,
    genderPolicy = 'any',
    images = [],
    ratingAvg,
    ratingCount,
    amenities = [],
  } = item

  const isDemo = String(_id).startsWith('demo-')
  const img =
    (Array.isArray(images) && images[0]) ||
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1200&auto=format&fit=crop'

  // Real items go to detail page; demo items jump to search for that city
  const detailUrl = isDemo ? `/search?city=${encodeURIComponent(city)}` : `/listing/${_id}`

  // Show a few amenities as chips
  const amenPreview = Array.isArray(amenities) ? amenities.slice(0, 3) : []

  return (
    <div className="group relative overflow-hidden card transition hover:shadow-lg" data-id={_id}>
      {/* Cover image */}
      <Link to={detailUrl} aria-label={`Open ${title}`}>
        <div className="relative h-44 w-full overflow-hidden">
          <Img
            src={img}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          {/* Price badge */}
          {price !== undefined && price !== null && (
            <div className="absolute left-2 top-2 z-10 rounded-xl bg-white/90 dark:bg-slate-900/70 backdrop-blur px-2 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <IndianRupee size={14} />
              {formatINR(price)}
            </div>
          )}

          {/* Rating badge */}
          {ratingAvg !== undefined && ratingAvg !== null && (
            <div className="absolute right-2 top-2 z-10 rounded-xl bg-black/70 text-white px-2 py-1 text-xs font-semibold flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {Number(ratingAvg).toFixed(1)}
              {typeof ratingCount === 'number' && <span className="opacity-80">({ratingCount})</span>}
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          <span className="badge capitalize">{titleCase(genderPolicy)}</span>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <MapPin size={16} className="opacity-70 shrink-0" />
          <span className="line-clamp-1">{city}</span>
        </div>

        {description && (
          <p className="text-sm text-slate-700 dark:text-slate-200/90 line-clamp-2">{description}</p>
        )}

        {amenPreview.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {amenPreview.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 capitalize"
              >
                {String(a).replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        <Link to={detailUrl} className="btn btn-primary w-full mt-2">
          {isDemo ? `See PGs in ${city || 'this city'}` : 'View details'}
        </Link>
      </div>
    </div>
  )
}
