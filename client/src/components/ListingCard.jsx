import { Link } from 'react-router-dom'

export default function ListingCard({ item }) {
  return (
    <div className="card overflow-hidden">
      <img src={item.images?.[0] || 'https://picsum.photos/seed/x/800/500'} alt={item.title} className="w-full h-40 object-cover" />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1">{item.title}</h3>
          <div className="text-indigo-700 font-bold">₹{item.price}</div>
        </div>
        <div className="text-sm text-gray-600">{item.city} · {item.genderPolicy}</div>
        <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
        <Link to={`/listing/${item._id}`} className="btn btn-primary w-full mt-2">View</Link>
      </div>
    </div>
  )
}
