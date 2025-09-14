/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { myListings, deleteListing } from '../services/listings'
import { ownerRequests, updateBookingStatus } from '../services/bookings'
import {
  PlusCircle, Pencil, Trash2, ExternalLink, CalendarClock,
  Check, X, Building2, IndianRupee, MapPin
} from 'lucide-react'
import toast from 'react-hot-toast'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card p-5 flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 grid place-items-center">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[22px] font-extrabold leading-6">{value}</div>
        <div className="text-[12px] text-slate-500 dark:text-slate-400">{label}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const base = 'badge capitalize'
  if (status === 'accepted') return <span className={`${base} !bg-green-100 !text-green-700 dark:!bg-green-900/40 dark:!text-green-300`}>accepted</span>
  if (status === 'declined') return <span className={`${base} !bg-rose-100 !text-rose-700 dark:!bg-rose-900/40 dark:!text-rose-300`}>declined</span>
  return <span className={`${base} !bg-amber-100 !text-amber-700 dark:!bg-amber-900/40 dark:!text-amber-300`}>requested</span>
}

export default function OwnerDashboard() {
  const { user } = useAuth() || {}
  const nav = useNavigate()
  const qc = useQueryClient()

  useEffect(() => {
    if (user === undefined) return
    if (!user) nav('/login', { replace: true })
    else if (user.role !== 'owner') nav('/dashboard', { replace: true })
  }, [user, nav])

  const { data: listings = [], isFetching: loadingListings } = useQuery({
    enabled: !!user && user.role === 'owner',
    queryKey: ['listings', 'mine', user?.id],
    queryFn: myListings,
  })

  const { data: requests = [], isFetching: loadingReq } = useQuery({
    enabled: !!user && user.role === 'owner',
    queryKey: ['bookings', 'owner', user?.id],
    queryFn: ownerRequests,
  })

  const delMut = useMutation({
    mutationFn: (id) => deleteListing(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      qc.invalidateQueries({ queryKey: ['listings', 'mine'] })
      qc.invalidateQueries({ queryKey: ['bookings', 'owner'] })
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to delete'),
  })

  const updMut = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'owner'] }),
    onError: (e) => toast.error(e?.response?.data?.message || 'Update failed'),
  })

  const totalListings = Array.isArray(listings) ? listings.length : 0
  const pending = (Array.isArray(requests) ? requests : []).filter(r => r.status === 'requested')
  const accepted = (Array.isArray(requests) ? requests : []).filter(r => r.status === 'accepted')

  return (
    <div className="container-max section space-y-8">
      {/* HERO */}
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-300 font-semibold">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Owner Console
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Manage your listings and handle booking requests seamlessly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/owner" className="btn btn-primary"><PlusCircle size={16}/> Add Listing</Link>
            <Link to="/search" className="btn">Preview marketplace</Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Building2}     label="Total Listings"         value={totalListings} />
        <Stat icon={CalendarClock} label="Requests (Pending)"     value={pending.length} />
        <Stat icon={Check}         label="Requests (Accepted)"    value={accepted.length} />
        <Stat
          icon={IndianRupee}
          label="Avg. Price"
          value={
            totalListings
              ? Math.round(listings.reduce((a, l) => a + (l.price || 0), 0) / totalListings).toLocaleString('en-IN')
              : 0
          }
        />
      </div>

      {/* LISTINGS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Your Listings</h2>
          <Link to="/owner" className="btn"><PlusCircle size={16}/> Add Listing</Link>
        </div>

        {loadingListings ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-36 w-full mb-3" />
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : totalListings === 0 ? (
          <div className="card p-8 text-center">
            <h3 className="text-lg font-semibold">No listings yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Add your first PG to start receiving requests.
            </p>
            <Link to="/owner" className="btn btn-primary mt-4"><PlusCircle size={16}/> Add Listing</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map(l => (
              <div key={l._id} className="card overflow-hidden group">
                <div className="relative">
                  <img
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop'}
                    alt={l.title}
                    className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="price-badge">₹{(l.price ?? 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="font-semibold line-clamp-1">{l.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={14}/>{l.city}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link to={`/listing/${l._id}`} className="btn"><ExternalLink size={16}/> View</Link>
                    <Link to={`/owner`} className="btn"><Pencil size={16}/> Edit</Link>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        // eslint-disable-next-line no-restricted-globals
                        if (confirm('Delete this listing? This cannot be undone.')) {
                          delMut.mutate(l._id)
                        }
                      }}
                      disabled={delMut.isLoading}
                      title="Delete listing"
                    >
                      <Trash2 size={16}/> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REQUESTS */}
      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-bold">Booking Requests</h2>
        {loadingReq ? (
          <div className="grid md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-4 w-1/2 mb-2" />
                <div className="skeleton h-3 w-1/3 mb-3" />
                <div className="skeleton h-8 w-32" />
              </div>
            ))}
          </div>
        ) : (requests || []).length === 0 ? (
          <div className="card p-6 text-sm text-slate-600 dark:text-slate-300">No requests yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {requests.map((r) => (
              <div key={r._id} className="card p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{r.listing?.title || 'PG'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.seeker?.name || 'Seeker'} • {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === 'requested' && (
                    <>
                      <button
                        className="btn"
                        onClick={() => updMut.mutate({ id: r._id, status: 'accepted' })}
                        disabled={updMut.isLoading}
                      >
                        <Check size={16}/> Accept
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => updMut.mutate({ id: r._id, status: 'declined' })}
                        disabled={updMut.isLoading}
                      >
                        <X size={16}/> Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
