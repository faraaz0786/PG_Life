import { useQuery } from '@tanstack/react-query'
import { myFavorites } from '../services/favorites'
import { myBookings } from '../services/bookings'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/ListingCard'

export default function SeekerDashboard() {
  const { user } = useAuth()
  const { data: favs } = useQuery({ queryKey: ['favs'], queryFn: ()=> myFavorites() })
  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: ()=> myBookings() })

  return (
    <div className="container-max py-6 space-y-6">
      <h1 className="text-2xl font-bold">Hi, {user?.name}</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">My Favorites</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(favs||[]).map(item => <ListingCard key={item._id} item={item} />)}
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">My Bookings</h2>
        <div className="grid gap-3">
          {(bookings||[]).map(b => (
            <div key={b._id} className="card p-3 flex justify-between">
              <div>
                <div className="font-medium">{b.listingId?.title}</div>
                <div className="text-sm text-gray-600">{b.listingId?.city}</div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-gray-100">{b.status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
