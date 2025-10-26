/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { MapPin, IndianRupee, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip' // ✅ Tooltip import

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
    return String(n)
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

  const detailUrl = isDemo ? `/search?city=${encodeURIComponent(city)}` : `/listing/${_id}`
  const amenPreview = Array.isArray(amenities) ? amenities.slice(0, 3) : []

  const handleFavorite = () => {
    console.log('Added to favorites:', title)
    // Later replace this with your actual favorite API or context logic
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-surface rounded-2xl shadow-soft hover:shadow-card overflow-hidden group transition-all"
      data-id={_id}
    >
      {/* Cover image */}
      <Link to={detailUrl} aria-label={`Open ${title}`}>
        <div className="relative h-44 w-full overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 200 }}>
            <Img src={img} alt={title} className="h-full w-full object-cover" />
          </motion.div>

          {/* Price badge */}
          {price !== undefined && price !== null && (
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-xl bg-white/90 dark:bg-slate-900/70 backdrop-blur px-2 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
              <IndianRupee size={14} />
              {formatINR(price)}
            </div>
          )}

          {/* Rating badge */}
          {ratingAvg !== undefined && ratingAvg !== null && (
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-xl bg-black/70 text-white px-2 py-1 text-xs font-semibold">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {Number(ratingAvg).toFixed(1)}
              {typeof ratingCount === 'number' && (
                <span className="opacity-80">({ratingCount})</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold line-clamp-1 text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-brand/10 text-[11px] font-medium text-brand capitalize">
            {titleCase(genderPolicy)}
          </span>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <MapPin size={16} className="opacity-70 shrink-0" />
          <span className="line-clamp-1">{city}</span>
        </div>

        {description && (
          <p className="text-sm text-slate-700 dark:text-slate-200/90 line-clamp-2">
            {description}
          </p>
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

        {/* Buttons: View Details + Favorite */}
        <div className="flex items-center gap-2 mt-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Link
              to={detailUrl}
              className="block text-center w-full px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium shadow-sm hover:bg-brand-dark transition-all"
            >
              {isDemo ? `See PGs in ${city || 'this city'}` : 'View Details'}
            </Link>
          </motion.div>

          {/* ❤️ Tooltip-enabled favorite button */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavorite}
                className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition"
              >
                <Heart size={18} className="fill-current" />
              </motion.button>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={5}
                className="bg-gray-800 text-white text-sm px-2 py-1.5 rounded-md shadow-md"
              >
                Add to Favorites
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
    </motion.div>
  )
}
