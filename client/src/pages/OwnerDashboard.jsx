import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchListings, createListing, updateListing, deleteListing } from '../services/listings'
import { ownerBookings, updateBooking } from '../services/bookings'
import { useState } from 'react'

export default function OwnerDashboard() {
  const qc = useQueryClient()
  const { data: myBookings } = useQuery({ queryKey: ['ownerBookings'], queryFn: ()=> ownerBookings() })
  const { data: myListings } = useQuery({ queryKey: ['myListings'], queryFn: ()=> searchListings({}) })

  const [form, setForm] = useState({ title:'', description:'', city:'', address:'', genderPolicy:'any', price:5000, amenities:'wifi,food', images:'' })
  const createMut = useMutation({ mutationFn: ()=> createListing({ ...form, amenities: form.amenities.split(',').map(s=>s.trim()), images: form.images? form.images.split(',') : [] }), onSuccess: ()=> qc.invalidateQueries(['myListings']) })

  return (
    <div className="container-max py-6 space-y-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Create Listing</h2>
        <div className="card p-4 grid md:grid-cols-3 gap-3">
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="input" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
          <input className="input" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
          <select className="input" value={form.genderPolicy} onChange={e=>setForm({...form, genderPolicy:e.target.value})}>
            <option value="any">Any</option><option value="male">Male</option><option value="female">Female</option>
          </select>
          <input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
          <input className="input md:col-span-2" placeholder="Amenities (comma separated)" value={form.amenities} onChange={e=>setForm({...form, amenities:e.target.value})} />
          <input className="input md:col-span-2" placeholder="Image URLs (comma separated)" value={form.images} onChange={e=>setForm({...form, images:e.target.value})} />
          <button className="btn btn-primary md:col-span-1" onClick={()=> createMut.mutate()}>Create</button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">My Bookings</h2>
        <div className="grid gap-3">
          {(myBookings||[]).map(b => (
            <div key={b._id} className="card p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{b.listingId?.title}</div>
                <div className="text-sm text-gray-600">{b.listingId?.city}</div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg bg-gray-100">{b.status}</span>
                <button className="btn" onClick={()=> updateBooking(b._id, 'accepted').then(()=>window.location.reload())}>Accept</button>
                <button className="btn" onClick={()=> updateBooking(b._id, 'declined').then(()=>window.location.reload())}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">All Listings (latest)</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(myListings||[]).map(item => (
            <div key={item._id} className="card p-3 space-y-2">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-600">{item.city} · ₹{item.price}</div>
              <div className="flex gap-2">
                {/* For brevity, editing is omitted; you can extend easily */}
                <button className="btn" onClick={()=> alert('Edit flow not implemented in demo')}>Edit</button>
                <button className="btn" onClick={()=> deleteListing(item._id).then(()=>window.location.reload())}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
