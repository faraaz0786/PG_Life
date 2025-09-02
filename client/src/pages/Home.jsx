import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchListings } from '../services/listings'
import { recForMe } from '../services/recommendations'
import ListingCard from '../components/ListingCard'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Home() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [city, setCity] = useState('')
  const { data: featured } = useQuery({ queryKey: ['featured'], queryFn: ()=> searchListings({}) })
  const { data: recs } = useQuery({ enabled: !!user, queryKey: ['recs'], queryFn: ()=> recForMe() })

  return (
    <div className="container-max space-y-8 py-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">Find your perfect PG</h1>
        <p className="text-gray-600">Search by city, filter by budget and amenities, and book visits in one place.</p>
        <div className="flex gap-2 max-w-xl mx-auto">
          <input className="input flex-1" placeholder="Search by city..." value={city} onChange={e=>setCity(e.target.value)} />
          <button className="btn btn-primary" onClick={()=> nav(`/search?city=${encodeURIComponent(city)}`)}>Search</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Featured PGs</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured?.slice(0,8)?.map(item => <ListingCard key={item._id} item={item} />)}
        </div>
      </section>

      {user && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recs?.slice(0,8)?.map(item => <ListingCard key={item._id} item={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
