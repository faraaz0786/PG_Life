/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import {
  Filter as FilterIcon,
  MapPin,
  IndianRupee,
  Search as SearchIcon,
  ListChecks,
  Trash2,
  X,
} from 'lucide-react'

/**
 * Props:
 *  - preset: { city, minPrice, maxPrice, gender, amenities, q }
 *  - onApply: (filtersObj) => void
 *  - onClear: () => void
 */
export default function Filters({ preset = {}, onApply, onClear }) {
  const [city, setCity] = useState(preset.city || '')
  const [minPrice, setMinPrice] = useState(preset.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(preset.maxPrice || '')
  const [gender, setGender] = useState(preset.gender || '')
  const [amenitiesText, setAmenitiesText] = useState(preset.amenities || '')
  const [q, setQ] = useState(preset.q || '')
  const [open, setOpen] = useState(true) // collapsible for small screens

  // keep in sync with outer changes
  useEffect(() => {
    setCity(preset.city || '')
    setMinPrice(preset.minPrice || '')
    setMaxPrice(preset.maxPrice || '')
    setGender(preset.gender || '')
    setAmenitiesText(preset.amenities || '')
    setQ(preset.q || '')
  }, [preset])

  const amenityChips = useMemo(() => {
    return (amenitiesText || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }, [amenitiesText])

  const removeAmenity = (a) => {
    const next = amenityChips.filter(x => x.toLowerCase() !== a.toLowerCase())
    setAmenitiesText(next.join(', '))
  }

  const apply = () => onApply({
    city,
    minPrice,
    maxPrice,
    gender,
    amenities: amenitiesText,
    q,
  })

  const clear = () => {
    setCity(''); setMinPrice(''); setMaxPrice(''); setGender('');
    setAmenitiesText(''); setQ('');
    onClear?.()
  }

  const hasAny =
    (city && city.trim()) ||
    (minPrice && String(minPrice).trim()) ||
    (maxPrice && String(maxPrice).trim()) ||
    (gender && gender.trim()) ||
    (amenitiesText && amenitiesText.trim()) ||
    (q && q.trim())

  return (
    <section className="relative">
      {/* gradient halo */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-fuchsia-500/20 blur-xl" />

      {/* glass panel */}
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/65 dark:bg-slate-900/50 backdrop-blur-md shadow-xl">
        {/* header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-300">
              <FilterIcon size={16} />
            </span>
            <span className="font-semibold">Filters</span>
            {hasAny && (
              <span className="ml-2 rounded-full bg-slate-800/5 dark:bg-slate-100/5 px-2.5 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                {[
                  city && `City: ${city}`,
                  (minPrice || maxPrice) && `₹${minPrice || 0}–${maxPrice || '…'}`,
                  gender && `Gender: ${gender}`,
                  amenityChips.length > 0 && `${amenityChips.length} amenit${amenityChips.length > 1 ? 'ies' : 'y'}`,
                  q && `“${q}”`,
                ].filter(Boolean).join(' • ')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* body */}
        {open && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* City */}
              <Field label="City" icon={<MapPin size={16} />}>
                <input
                  className="input pl-10"
                  placeholder="e.g. Lucknow"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </Field>

              {/* Min price */}
              <Field label="Min Price" icon={<IndianRupee size={16} />}>
                <input
                  className="input pl-10"
                  inputMode="numeric"
                  placeholder="e.g. 3000"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value.replace(/[^\d]/g, ''))}
                />
              </Field>

              {/* Max price */}
              <Field label="Max Price" icon={<IndianRupee size={16} />}>
                <input
                  className="input pl-10"
                  inputMode="numeric"
                  placeholder="e.g. 15000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value.replace(/[^\d]/g, ''))}
                />
              </Field>

              {/* Gender */}
              <Field label="Gender Policy">
                <select
                  className="input"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Any</option>
                </select>
              </Field>

              {/* Amenities */}
              <Field label="Amenities (comma separated)" icon={<ListChecks size={16} /> } className="lg:col-span-2">
                <input
                  className="input pl-10"
                  placeholder="wifi, ac, food"
                  value={amenitiesText}
                  onChange={e => setAmenitiesText(e.target.value)}
                />
              </Field>

              {/* Keywords */}
              <Field label="Keywords" icon={<SearchIcon size={16} />} className="lg:col-span-6">
                <input
                  className="input pl-10"
                  placeholder="e.g. Koramangala, balcony, attached bathroom"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') apply() }}
                />
              </Field>
            </div>

            {/* amenity chips preview */}
            {amenityChips.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {amenityChips.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-2 py-1 text-xs text-slate-700 dark:text-slate-200">
                    {a}
                    <button onClick={() => removeAmenity(a)} className="opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={apply} className="btn btn-primary h-11 px-5">
                Apply Filters
              </button>
              <button onClick={clear} className="btn h-11">
                <Trash2 size={16} /> Clear
              </button>
              <span className="ml-auto hidden md:inline text-xs text-slate-500 dark:text-slate-400">
                Tip: press <kbd className="rounded-md border px-1 text-[11px]">Enter</kbd> in a field to apply
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, icon, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">{label}</label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">{icon}</span>
        )}
        {children}
      </div>
    </div>
  )
}
