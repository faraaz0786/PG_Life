// client/src/pages/Search.jsx
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchListings } from '../services/listings'
import ListingCard from '../components/ListingCard'
import SkeletonCard from '../components/SkeletonCard'
import Filters from '../components/Filters'
import { buildSearchParams, parseSearchParams } from '../utils/urlFilters.js'
import toast from 'react-hot-toast'
import { Frown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { demoListings } from '../data/demoListings'

const quickCities = ['Lucknow','Delhi','Mumbai','Bengaluru','Hyderabad','Pune','Chennai','Kolkata']
const roomTypes = ['single','twin','triple','quad']
const groupOrder = ['single','twin','triple','quad','other']

function cleanParams(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    if (Array.isArray(v) && v.length === 0) continue
    out[k] = v
  }
  return out
}

function noActiveFilters(f) {
  return !(
    (f.city && f.city.trim()) ||
    (f.minPrice && String(f.minPrice).trim()) ||
    (f.maxPrice && String(f.maxPrice).trim()) ||
    (f.gender && f.gender.trim()) ||
    (f.amenities && String(f.amenities).trim()) ||
    (f.roomType && f.roomType.trim()) ||
    (f.q && f.q.trim())
  )
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  // 1) Initialize from URL
  const initial = useMemo(() => parseSearchParams(searchParams), [searchParams])
  const [filters, setFilters] = useState({
    city: initial.city || '',
    minPrice: initial.minPrice || '',
    maxPrice: initial.maxPrice || '',
    gender: initial.gender || '',
    amenities: initial.amenities || '',
    roomType: initial.roomType || '', // '' => ALL
    q: initial.q || ''
  })
  const [page, setPage] = useState(initial.page || 1)
  const limit = 12

  // Exploration modes:
  // - globalExploration: no filters at all
  // - cityExploration: ONLY city selected (everything else blank / ALL)
  const globalExploration = noActiveFilters(filters)
  const cityOnly =
    !!filters.city &&
    !filters.minPrice && !filters.maxPrice &&
    !filters.gender && !filters.amenities &&
    !filters.roomType && !filters.q
  const exploration = globalExploration || cityOnly

  // 2) Classic search (when there ARE filters beyond "only city")
  const searchQ = useQuery({
    queryKey: ['search', filters, page],
    queryFn: () => searchListings(cleanParams({ ...filters, page, limit })),
    keepPreviousData: true,
    enabled: !exploration, // disabled in exploration modes
  })

  // 3) Popular (global)
  const popularQGlobal = useQuery({
    queryKey: ['popular-global', limit],
    queryFn: () => searchListings({ page: 1, limit: 12, sort: '-createdAt' }),
    keepPreviousData: true,
    enabled: globalExploration,
  })

  // 4) Popular (city-scoped)
  const popularQCity = useQuery({
    queryKey: ['popular-city', filters.city, limit],
    queryFn: () => searchListings({ page: 1, limit: 12, sort: '-createdAt', city: filters.city }),
    keepPreviousData: true,
    enabled: cityOnly,
  })

  // 5) Client-side recommendations (use the relevant popular pool)
  const recommended = useMemo(() => {
    const pool = cityOnly
      ? (popularQCity.data?.items?.length ? popularQCity.data.items : demoListings.filter(d => (d.city||'').toLowerCase() === (filters.city||'').toLowerCase()))
      : (popularQGlobal.data?.items?.length ? popularQGlobal.data.items : demoListings)

    if (!user) return pool.slice(0, 12)

    const prefs = user.preferences || {}
    const min = prefs.minBudget ?? 0
    const max = prefs.maxBudget ?? Infinity
    const prefCity = (prefs.city || '').toLowerCase()
    const prefAmenities = new Set((prefs.amenities || []).map(a => a.toLowerCase()))

    const scored = pool.map(d => {
      let s = 0
      if (prefCity && (d.city || '').toLowerCase() === prefCity) s += 5
      if (d.price >= min && d.price <= max) s += 3
      const ams = (d.amenities || []).map(a => a.toLowerCase())
      const overlap = ams.filter(a => prefAmenities.has(a)).length
      s += overlap
      s += (d.ratingAvg || 0) / 2
      return { ...d, _score: s }
    }).sort((a,b) => b._score - a._score)

    return scored.slice(0, 12)
  }, [user, cityOnly, filters.city, popularQCity.data, popularQGlobal.data])

  // 6) Apply → URL. Treat 'all' as ''.
  const applyFilters = (f) => {
    const nextRoomType = (f.roomType === 'all')
      ? ''
      : (f.roomType ?? filters.roomType)

    const next = { ...filters, ...f, roomType: nextRoomType, page: 1, limit }
    setFilters(prev => ({ ...prev, ...f, roomType: nextRoomType }))
    setPage(1)
    setSearchParams(buildSearchParams(next))
  }

  // 7) Chips
  const selectCity = (c) => {
    // Reset all other filters and force ALL room types
    const cleared = {
      city: c,
      roomType: '',
      minPrice: '',
      maxPrice: '',
      gender: '',
      amenities: '',
      q: '',
    }
    applyFilters(cleared)
  }
  const selectRoomType = (rt) => {
    const normalized = (rt === 'all' ? '' : rt)
    const nextRT = filters.roomType === normalized ? '' : normalized // toggle
    applyFilters({ roomType: nextRT })
  }

  // 8) Sync URL → state
  useEffect(() => {
    const p = parseSearchParams(searchParams)
    setFilters({
      city: p.city || '',
      minPrice: p.minPrice || '',
      maxPrice: p.maxPrice || '',
      gender: p.gender || '',
      amenities: p.amenities || '',
      roomType: p.roomType || '',
      q: p.q || ''
    })
    setPage(p.page || 1)
  }, [searchParams])

  // 9) Decide data sources
  const isFetching = exploration
    ? (cityOnly ? popularQCity.isFetching : popularQGlobal.isFetching)
    : searchQ.isFetching

  const isError = exploration
    ? (cityOnly ? popularQCity.isError : popularQGlobal.isError)
    : searchQ.isError

  const error = exploration
    ? (cityOnly ? popularQCity.error : popularQGlobal.error)
    : searchQ.error

  const itemsExploration = cityOnly
    ? (popularQCity.data?.items || [])
    : (popularQGlobal.data?.items || [])

  const result = exploration ? { items: itemsExploration, page: 1, pages: 1 } : (searchQ.data || null)
  const items = Array.isArray(result) ? result : (result?.items || [])
  const totalPages = Array.isArray(result) ? 1 : (result?.pages || 1)
  const currentPage = Array.isArray(result) ? 1 : (result?.page || page)
  const activeCity = (filters.city || '').toLowerCase()

  const nextPage = () => {
    if (currentPage >= totalPages) return
    const next = { ...filters, page: currentPage + 1, limit }
    setPage(currentPage + 1)
    setSearchParams(buildSearchParams(next))
  }
  const prevPage = () => {
    if (currentPage <= 1) return
    const next = { ...filters, page: currentPage - 1, limit }
    setPage(currentPage - 1)
    setSearchParams(buildSearchParams(next))
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Shareable link copied!')
    } catch {
      toast.error('Could not copy link')
    }
  }

  // Grouped view for classic mode when roomType === '' (ALL)
  const grouped = useMemo(() => {
    const g = { single: [], twin: [], triple: [], quad: [], other: [] }
    for (const it of items) {
      const rt = (it.roomType || '').toLowerCase()
      if (g[rt]) g[rt].push(it)
      else g.other.push(it)
    }
    return g
  }, [items])

  return (
    <div className="container-max section space-y-6">
      {/* Top chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Popular cities:</span>

        {quickCities.map(c => {
          const active = activeCity === c.toLowerCase()
          return (
            <button
              key={c}
              onClick={() => selectCity(c)}
              className={`px-3 h-8 rounded-full border text-sm transition
                          ${active
                            ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                            : 'border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/70'
                          }`}
              title={`Show PGs in ${c}`}
            >
              {c}
            </button>
          )
        })}

        <button
          onClick={() => selectCity('')}
          className={`px-3 h-8 rounded-full border text-sm transition
                      ${activeCity === ''
                        ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/70'
                      }`}
          title="Show all cities"
        >
          All
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Room type:</span>

          <button
            onClick={() => selectRoomType('all')}
            className={`px-3 h-8 rounded-full border text-sm transition
                        ${!filters.roomType
                          ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                          : 'border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/70'
                        }`}
            title="All room types"
          >
            All
          </button>

          {roomTypes.map(rt => (
            <button
              key={rt}
              onClick={() => selectRoomType(rt)}
              className={`px-3 h-8 rounded-full border text-sm capitalize transition
                          ${filters.roomType === rt
                            ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                            : 'border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/70'
                          }`}
              title={`Filter ${rt}`}
            >
              {rt}
            </button>
          ))}

          <button className="btn h-9" onClick={copyShareLink}>Share search</button>
        </div>
      </div>

      {/* Filters panel */}
      <Filters
        preset={filters}
        onApply={applyFilters}
        onClear={() => setSearchParams(buildSearchParams({ page: 1, limit }))}
      />

      {/* Exploration views */}
      {exploration ? (
        <>
          {/* Popular block (global or city-scoped) */}
          <section className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">
              {cityOnly ? `Popular Right Now in ${filters.city}` : 'Popular Right Now'}
            </h2>
            {isFetching ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(itemsExploration.length ? itemsExploration : (
                  cityOnly
                    ? demoListings.filter(d => (d.city||'').toLowerCase() === activeCity).slice(0,12)
                    : demoListings.slice(0,12)
                )).map(item => <ListingCard key={item._id} item={item} />)}
              </div>
            )}
          </section>

          {/* Recommended block (global or city-scoped) */}
          <section className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">
              {cityOnly ? `Recommended for You in ${filters.city}` : 'Recommended for You'}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map(item => <ListingCard key={item._id} item={item} />)}
            </div>
          </section>
        </>
      ) : (
        // Classic search (any filter beyond only-city)
        <>
          {/* Status */}
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <div>
              {isFetching ? 'Loading…' : `Showing ${items.length} result(s)`} {searchQ.data?.total ? `of ${searchQ.data.total}` : ''}
              {filters.city && !isFetching && <span> in <b>{filters.city}</b></span>}
              {filters.q && !isFetching && <span> for “{filters.q}”</span>}
              {!filters.roomType && !isFetching && <span> • All room types</span>}
              {filters.roomType && !isFetching && <span> • {filters.roomType}</span>}
            </div>
            {isError && <span className="text-red-600">Error: {error?.message || 'Failed to load'}</span>}
          </div>

          {/* Loading */}
          {isFetching && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!isFetching && items.length === 0 && (
            <div className="rounded-2xl border border-slate-200/40 dark:border-slate-800/40 p-8 text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="mx-auto h-12 w-12 rounded-2xl grid place-items-center bg-slate-100 dark:bg-slate-800 text-slate-500 mb-4">
                <Frown size={22} />
              </div>
              <h3 className="text-lg font-semibold">
                {filters.city ? `No results in ${filters.city}` : 'No results'}
                {filters.roomType ? ` • ${filters.roomType}` : ''}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Try adjusting price, gender policy, room type, or removing some amenities.
              </p>
              <button
                className="btn mt-4"
                onClick={() => setSearchParams(buildSearchParams({ page: 1, limit }))}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Results (flat or grouped) */}
          {!isFetching && items.length > 0 && (
            <>
              {filters.roomType ? (
                <>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map(item => <ListingCard key={item._id} item={item} />)}
                  </div>
                  <div className="flex items-center justify-center gap-3 py-6">
                    <button className="btn" disabled={currentPage <= 1 || isFetching} onClick={prevPage}>
                      Prev
                    </button>
                    <span className="text-sm">Page {currentPage} / {totalPages}</span>
                    <button className="btn" disabled={currentPage >= totalPages || isFetching} onClick={nextPage}>
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  {groupOrder.map((rt) => (
                    grouped[rt] && grouped[rt].length > 0 ? (
                      <section key={rt} className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-bold capitalize">{rt} Rooms</h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {grouped[rt].map(item => <ListingCard key={item._id} item={item} />)}
                        </div>
                      </section>
                    ) : null
                  ))}
                  <div className="flex items-center justify-center gap-3 py-6">
                    <button className="btn" disabled={currentPage <= 1 || isFetching} onClick={prevPage}>
                      Prev
                    </button>
                    <span className="text-sm">Page {currentPage} / {totalPages}</span>
                    <button className="btn" disabled={currentPage >= totalPages || isFetching} onClick={nextPage}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
