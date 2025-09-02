import { useState } from 'react'

export default function Filters({ onApply }) {
  const [city, setCity] = useState('')
  const [minPrice, setMin] = useState('')
  const [maxPrice, setMax] = useState('')
  const [gender, setGender] = useState('')
  const [amenities, setAmenities] = useState('')

  return (
    <div className="card p-4 grid md:grid-cols-5 gap-3">
      <input className="input" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
      <input className="input" placeholder="Min Price" value={minPrice} onChange={e=>setMin(e.target.value)} />
      <input className="input" placeholder="Max Price" value={maxPrice} onChange={e=>setMax(e.target.value)} />
      <select className="input" value={gender} onChange={e=>setGender(e.target.value)}>
        <option value="">Any Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="any">Any</option>
      </select>
      <input className="input md:col-span-2" placeholder="Amenities (comma separated)" value={amenities} onChange={e=>setAmenities(e.target.value)} />
      <button className="btn btn-primary md:col-span-3" onClick={()=> onApply({ city, minPrice, maxPrice, gender, amenities })}>Apply Filters</button>
    </div>
  )
}
