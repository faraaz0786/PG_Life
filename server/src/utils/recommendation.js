/**
 * Compute a simple score:
 *  + City match (weight 3)
 *  + Budget fit (weight 3) — within [min,max]
 *  + Amenity overlap ratio (weight 2)
 *  + Popularity (avg rating 1..5) (weight 2)
 */
function scoreListing(listing, prefs, stats) {
  const weights = { city: 3, budget: 3, amenities: 2, popularity: 2 };
  let score = 0;
  // City
  if (prefs.city && listing.city.toLowerCase() === prefs.city.toLowerCase()) {
    score += weights.city;
  }
  // Budget
  const min = prefs.minBudget ?? 0, max = prefs.maxBudget ?? Number.MAX_SAFE_INTEGER;
  if (listing.price >= min && listing.price <= max) {
    score += weights.budget;
  }
  // Amenities
  const want = new Set((prefs.amenities || []).map(a => a.toLowerCase()));
  const have = new Set((listing.amenities || []).map(a => a.toLowerCase()));
  let overlap = 0;
  if (want.size > 0) {
    for (const a of want) if (have.has(a)) overlap++;
    score += (overlap / want.size) * weights.amenities;
  }
  // Popularity
  const ratingAvg = stats?.avgRating || 0;
  score += (ratingAvg / 5) * weights.popularity;
  return score;
}

module.exports = { scoreListing };
