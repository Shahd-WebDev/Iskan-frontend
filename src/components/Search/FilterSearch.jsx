import { allProperties } from "../data/PropertiesData";

export const EMPTY_FILTERS = { location: "", propertyType: "", priceRange: "", rooms: "", facilities: [] };

export const PRICE_BUCKETS = [
  { label: "800 - 1000",  min: 800,  max: 1000 },
  { label: "1000 - 1300", min: 1000, max: 1300 },
  { label: "1300 - 1600", min: 1300, max: 1600 },
  { label: "1600 - 2000", min: 1600, max: 2000 },
  { label: "2000+",       min: 2001, max: Infinity },
];

export function matchesPrice(p, priceRange) {
  if (!priceRange) return true;
  const price = parseInt(p.price);
  if (priceRange === "2000+") return price > 2000;
  const parts = priceRange.split("-").map((s) => s.trim());
  let match = true;
  if (parts[0]) match = price >= parseInt(parts[0]);
  if (parts[1]) match = match && price <= parseInt(parts[1]);
  return match;
}

export function applyFilters(list, filters) {
  return list.filter((p) => {
    if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.propertyType && p.type.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    if (!matchesPrice(p, filters.priceRange)) return false;
    if (filters.rooms && p.rooms !== parseInt(filters.rooms)) return false;
    if (filters.facilities?.length > 0 && !filters.facilities.every((f) => p.amenities.includes(f))) return false;
    return true;
  });
}

export function detectSearchIntent(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { filters: EMPTY_FILTERS, matched: false };

  const allLocations = [...new Set(allProperties.map((p) => p.location.split(",")[0].trim().toLowerCase()))];
  const allTypes     = [...new Set(allProperties.map((p) => p.type.toLowerCase()))];
  const allAmenities = [...new Set(allProperties.flatMap((p) => p.amenities.map((a) => a.toLowerCase())))];
  const allRooms     = [...new Set(allProperties.map((p) => p.rooms))];

  const matchedLocation = allLocations.find((loc) => loc.includes(q) || q.includes(loc));
  if (matchedLocation) {
    const original = allProperties.find((p) =>
      p.location.split(",")[0].trim().toLowerCase() === matchedLocation
    )?.location.split(",")[0].trim();
    return { filters: { ...EMPTY_FILTERS, location: original || matchedLocation }, matched: true };
  }

  const matchedType = allTypes.find((t) => t === q || t.includes(q));
  if (matchedType) {
    const original = allProperties.find((p) => p.type.toLowerCase() === matchedType)?.type;
    return { filters: { ...EMPTY_FILTERS, propertyType: original || matchedType }, matched: true };
  }

  const numQ = parseInt(q);
  if (!isNaN(numQ) && allRooms.includes(numQ)) {
    return { filters: { ...EMPTY_FILTERS, rooms: String(numQ) }, matched: true };
  }

  if (!isNaN(numQ) && numQ > 10) {
    const bucket = PRICE_BUCKETS.find(({ min, max }) => numQ >= min && numQ <= max);
    if (bucket) return { filters: { ...EMPTY_FILTERS, priceRange: bucket.label }, matched: true };
  }
  const matchedBucket = PRICE_BUCKETS.find((b) => b.label.toLowerCase() === q);
  if (matchedBucket) return { filters: { ...EMPTY_FILTERS, priceRange: matchedBucket.label }, matched: true };

  const matchedAmenity = allAmenities.find((a) => a.includes(q) || q.includes(a));
  if (matchedAmenity) {
    const original = allProperties.flatMap((p) => p.amenities).find((a) => a.toLowerCase() === matchedAmenity);
    return { filters: { ...EMPTY_FILTERS, facilities: [original || matchedAmenity] }, matched: true };
  }

  return { filters: EMPTY_FILTERS, matched: false };
}

export function hasAnyFilter(filters) {
  return (
    !!filters.location ||
    !!filters.propertyType ||
    !!filters.priceRange ||
    !!filters.rooms ||
    (filters.facilities?.length > 0)
  );
}