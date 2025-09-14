// client/src/utils/urlFilters.js

// ---- roomType helpers ----
const ALLOWED_RT = ['single', 'twin', 'triple', 'quad', 'other'];
const normalizeRoomType = (v) => {
  if (v === undefined || v === null) return undefined;
  const rt = String(v).trim().toLowerCase();
  if (rt === '' || rt === 'all' || rt === 'any') return undefined;
  return ALLOWED_RT.includes(rt) ? rt : 'other';
};

// ---- parse: URLSearchParams -> plain object ----
export const parseSearchParams = (sp) => {
  // Accept both URLSearchParams and strings
  if (!(sp instanceof URLSearchParams)) sp = new URLSearchParams(sp);
  const get = (k) => sp.get(k);

  const obj = {};

  const city = get('city');
  if (city) obj.city = city;

  const toNum = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  };

  const minPrice = toNum(get('minPrice'));
  if (minPrice !== undefined) obj.minPrice = minPrice;

  const maxPrice = toNum(get('maxPrice'));
  if (maxPrice !== undefined) obj.maxPrice = maxPrice;

  // Back-compat: support 'genderPolicy' too
  const gender = get('gender') || get('genderPolicy');
  if (gender) obj.gender = gender;

  // Keep amenities as CSV string (Filters component can split if needed)
  const amenities = get('amenities');
  if (amenities) obj.amenities = amenities;

  const q = get('q');
  if (q) obj.q = q;

  // roomType
  const rt = normalizeRoomType(get('roomType'));
  if (rt) obj.roomType = rt;

  const page = toNum(get('page')) ?? 1;
  obj.page = page > 0 ? page : 1;

  const limit = toNum(get('limit')) ?? 12;
  obj.limit = limit > 0 ? limit : 12;

  return obj;
};

// ---- build: filters object -> URLSearchParams ----
export const buildSearchParams = (filters = {}) => {
  const sp = new URLSearchParams();
  const set = (k, v) => {
    if (v !== undefined && v !== null && String(v).trim() !== '') sp.set(k, String(v).trim());
    else sp.delete(k);
  };

  set('city', filters.city);
  set('minPrice', filters.minPrice);
  set('maxPrice', filters.maxPrice);
  set('gender', filters.gender);

  if (Array.isArray(filters.amenities)) {
    if (filters.amenities.length) sp.set('amenities', filters.amenities.join(','));
    else sp.delete('amenities');
  } else {
    set('amenities', filters.amenities);
  }

  set('q', filters.q);

  // roomType (only valid values)
  const rt = normalizeRoomType(filters.roomType);
  if (rt) sp.set('roomType', rt);
  else sp.delete('roomType');

  // Only include non-default page/limit to keep URLs clean
  const page = Number(filters.page || 1);
  if (page > 1) sp.set('page', String(page)); else sp.delete('page');

  const limit = Number(filters.limit || 12);
  if (limit !== 12) sp.set('limit', String(limit)); else sp.delete('limit');

  return sp;
};
