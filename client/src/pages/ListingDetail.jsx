import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getListing } from '../services/listings'
import { addReview, getReviews } from '../services/reviews'
import { addFavorite } from '../services/favorites'
import { createBooking } from '../services/bookings'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MapPin, IndianRupee, Shield, Star } from 'lucide-react'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: item, isFetching: loadingItem, isError: itemErr } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListing(id)
  })
  const { data: reviews, refetch } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(id)
  })

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  const onFav = async () => {
    try { await addFavorite(id); toast.success('Added to favorites') }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed to add to favorites') }
  }
  const onBook = async () => {
    try { await createBooking({ listingId: id }); toast.success('Booking requested') }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed to create booking') }
  }
  const onReview = async () => {
    try { await addReview({ listingId: id, rating, comment }); setComment(''); toast.success('Review posted'); await refetch() }
    catch (e) { toast.error(e?.response?.data?.message || 'Failed to post review') }
  }

  if (loadingItem) return <div className="container-max py-6">Loading...</div>
  if (itemErr || !item) return <div className="container-max py-6 text-red-600">Failed to load listing.</div>

  const images = item.images?.length ? item.images : ['https://picsum.photos/seed/placeholder/800/500']

  return (
    <div className="container-max section space-y-6">
      {/* Top: gallery + info + sticky actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Gallery */}
        <div className="lg:col-span-2 space-y-3">
          <div className="card overflow-hidden">
            <img src={images[activeImg]} className="w-full h-96 object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {images.slice(0, 8).map((src, i) => (
              <button key={i} className={`card overflow-hidden ${i===activeImg ? 'ring-2 ring-brand-500' : ''}`} onClick={()=> setActiveImg(i)}>
                <img src={src} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Sticky booking card */}
        <aside className="lg:col-span-1">
          <div className="card p-4 sticky top-24 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold flex items-center gap-1">
                <IndianRupee size={20} /> {item.price}
              </div>
              <div className="badge flex items-center gap-1">
                <Star size={14} /> {Number(item.ratingAvg || 0).toFixed(1)} ({item.ratingCount || 0})
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <MapPin size={16} /> {item.city} · {item.address}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Shield size={16} /> Gender policy: <b className="capitalize">{item.genderPolicy}</b>
            </div>
            {user?.role === 'seeker' && (
              <div className="flex gap-2 pt-2">
                <button className="btn flex-1" onClick={onFav}>Add to Favorites</button>
                <button className="btn btn-primary flex-1" onClick={onBook}>Request Booking</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-4 space-y-3">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <p className="text-slate-700 dark:text-slate-200/90">{item.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {(item.amenities || []).map(a =>
              <span key={a} className="badge capitalize">{a.replaceAll('_',' ')}</span>
            )}
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Reviews</h2>
          <div className="space-y-3 max-h-80 overflow-auto pr-2">
            {(reviews || []).map(r => (
              <div key={r._id} className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="font-medium">{r.seekerId?.name || 'User'} · {r.rating}★</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{r.comment}</p>
              </div>
            ))}
            {(reviews || []).length === 0 && <div className="text-sm text-slate-500">No reviews yet.</div>}
          </div>

          {user?.role === 'seeker' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm">Rating</label>
                <input className="input w-24" type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} />
              </div>
              <textarea className="textarea" rows="3" placeholder="Write a review..." value={comment} onChange={e => setComment(e.target.value)} />
              <button className="btn btn-primary w-full" onClick={onReview}>Submit Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
