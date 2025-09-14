import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { myFavorites } from '../services/favorites'
import { myBookings } from '../services/bookings'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/ListingCard'
import { Heart, CalendarClock, CheckCircle2, Search, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatTile({ icon: Icon, label, value, hint }) {
  return (
    <div className="card p-5 flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-300 grid place-items-center">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-[22px] font-extrabold leading-6">{value}</div>
        <div className="text-[12px] text-slate-500 dark:text-slate-400">{label}</div>
      </div>
      {hint && <div className="text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  )
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      {action}
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc, cta }) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl grid place-items-center bg-slate-100 dark:bg-slate-800 text-slate-500 mb-3">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{desc}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  )
}

export default function SeekerDashboard() {
  const { user } = useAuth()
  const favQ = useQuery({ queryKey: ['favs'], queryFn: myFavorites })
  const bookQ = useQuery({ queryKey: ['bookings'], queryFn: myBookings })

  const favorites = Array.isArray(favQ.data) ? favQ.data : []
  const bookings  = Array.isArray(bookQ.data) ? bookQ.data : []

  const pending   = useMemo(() => bookings.filter(b => b.status === 'requested'), [bookings])
  const accepted  = useMemo(() => bookings.filter(b => b.status === 'accepted'), [bookings])

  return (
    <div className="container-max section space-y-8">
      {/* HERO */}
      <div className="card relative overflow-hidden p-6 md:p-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-300 font-semibold">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Your Seeker Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Pick up where you left off — check favourites, track bookings, and discover recommended PGs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/search" className="btn btn-primary"><Search size={16}/> Explore PGs</Link>
            <Link to="/search?roomType=single" className="btn">Single Rooms</Link>
            <Link to="/search?roomType=twin" className="btn">Twin Sharing</Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Heart}         label="Favourites"         value={favorites.length} />
        <StatTile icon={CalendarClock} label="Visits Requested"   value={pending.length} />
        <StatTile icon={CheckCircle2}  label="Accepted Visits"    value={accepted.length} />
        <StatTile icon={Star}          label="Avg. Budget Match"  value={Math.round( (favorites.slice(0,1)[0]?.price || 6500) / 1000 ) + 'k'} hint="approx." />
      </div>

      {/* FAVOURITES */}
      <section className="space-y-3">
        <SectionHeader
          title="My Favourites"
          action={<Link to="/search" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Find more</Link>}
        />
        {favQ.isFetching ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-32 w-full mb-3" />
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            desc="Shortlist PGs you love, and they’ll show up here."
            cta={<Link to="/search" className="btn btn-primary"><Search size={16}/> Browse PGs</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map(item => <ListingCard key={item._id} item={item} />)}
          </div>
        )}
      </section>

      {/* BOOKINGS */}
      <section className="space-y-3">
        <SectionHeader title="My Bookings / Visit Requests" />
        {bookQ.isFetching ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-4 w-1/2 mb-2" />
                <div className="skeleton h-3 w-1/3 mb-2" />
                <div className="skeleton h-8 w-28" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No bookings yet"
            desc="Once you request a visit, you’ll see the status here."
            cta={<Link to="/search" className="btn">Book a visit</Link>}
          />
        ) : (
          <div className="grid gap-3">
            {bookings.map(b => {
              const statusColor =
                b.status === 'accepted'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : b.status === 'declined'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'

              const listing = b.listing || b.listingId || {}
              return (
                <div key={b._id} className="card p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop'}
                      alt={listing.title || 'PG'}
                      className="h-14 w-20 rounded-lg object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <div className="font-semibold line-clamp-1">{listing.title || 'PG'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {listing.city || '—'} • {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${statusColor} capitalize`}>{b.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
