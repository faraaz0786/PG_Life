import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchListings } from '../services/listings'
import ListingCard from '../components/ListingCard'
import Filters from '../components/Filters'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState({
    city: params.get('city') || '',
    minPrice: '', maxPrice: '', gender: '', amenities: ''
  })

  const { data, refetch } = useQuery({
    queryKey: ['search', filters],
    queryFn: ()=> searchListings({ ...filters }),
  })

  useEffect(()=>{ refetch() }, [filters.city, filters.minPrice, filters.maxPrice, filters.gender, filters.amenities])

  return (
    <div className="container-max space-y-4 py-6">
      <Filters onApply={setFilters} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map(item => <ListingCard key={item._id} item={item} />)}
      </div>
    </div>
  )
}
