import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getListing } from '../services/listings'
import { addReview, getReviews } from '../services/reviews'
import { addFavorite } from '../services/favorites'
import { createBooking } from '../services/bookings'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: item } = useQuery({ queryKey: ['listing', id], queryFn: ()=> getListing(id) })
  const { data: reviews, refetch } = useQuery({ queryKey: ['reviews', id], queryFn: ()=> getReviews(id) })
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const onFav = async ()=> { await addFavorite(id); alert('Added to favorites') }
  const onBook = async ()=> { await createBooking({ listingId: id }); alert('Booking requested') }
  const onReview = async ()=> { await addReview({ listingId: id, rating, comment }); setComment(''); await refetch() }

  if (!item) return null

  return (
    <div className="container-max py-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <img className="w-full h-72 object-cover rounded-2xl" src={item.images?.[0] || 'https://picsum.photos/seed/x/800/500'} />
          <div className="grid grid-cols-3 gap-2">
            {(item.images || []).slice(1,4).map((src,i)=> <img key={i} className="h-28 w-full object-cover rounded-xl" src={src} />)}
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="text-gray-600">{item.city} · {item.address}</div>
          <div>Gender Policy: <b>{item.genderPolicy}</b></div>
          <div className="flex flex-wrap gap-2">
            {(item.amenities||[]).map(a=> <span key={a} className="px-2 py-1 bg-gray-100 rounded-lg text-sm">{a}</span>)}
          </div>
          <div className="text-2xl font-semibold">₹{item.price}</div>
          {user?.role === 'seeker' && (
            <div className="flex gap-2">
              <button className="btn" onClick={onFav}>Add to Favorites</button>
              <button className="btn btn-primary" onClick={onBook}>Request Booking</button>
            </div>
          )}
          <div className="text-sm text-gray-600">Rating: {Number(item.ratingAvg||0).toFixed(1)} ({item.ratingCount||0} reviews)</div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="space-y-3">
          {(reviews||[]).map(r => (
            <div key={r._id} className="card p-3">
              <div className="font-medium">{r.seekerId?.name || 'Anonymous'} · {r.rating}★</div>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>

        {user?.role === 'seeker' && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <label>Rating</label>
              <input className="input w-24" type="number" min="1" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} />
            </div>
            <textarea className="input" rows="3" placeholder="Write a review..." value={comment} onChange={e=>setComment(e.target.value)} />
            <button className="btn btn-primary" onClick={onReview}>Submit Review</button>
          </div>
        )}
      </section>
    </div>
  )
}
