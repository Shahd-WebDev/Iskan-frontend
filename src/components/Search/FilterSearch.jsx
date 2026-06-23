export const EMPTY_FILTERS = { location: "", propertyType: "", priceRange: "", rooms: "", facilities: [], search: "" };

export const PRICE_BUCKETS = [
  { label: "Less than 1000", min: 0,    max: 999  },
  { label: "1000 - 2000",    min: 1000, max: 2000 },
  { label: "2000 - 3000",    min: 2001, max: 3000 },
  { label: "3000 - 4000",    min: 3001, max: 4000 },
  { label: "4000 - 5000",    min: 4001, max: 5000 },
  { label: "5000 - 6000",    min: 5001, max: 6000 },
  { label: "6000 - 7000",    min: 6001, max: 7000 },
  { label: "7000+",          min: 7001, max: Infinity },
];
export function getAvailablePriceBuckets(properties) {
  if (!properties.length) return PRICE_BUCKETS;
  const maxPrice = Math.max(...properties.map((p) => parseInt(p.pricePerMonth || p.price || 0)));
  return PRICE_BUCKETS.filter((b) => 
    properties.some((p) => {
      const price = parseInt(p.pricePerMonth || p.price || 0);
      return price >= b.min && price <= b.max;
    })
  );
}

export function matchesPrice(p, priceRange) {
  if (!priceRange) return true;
  const price = parseInt(p.pricePerMonth || p.price || 0);
  if (priceRange === "7000+") return price >= 7001;
  if (priceRange === "Less than 1000") return price < 1000;
  const parts = priceRange.split("-").map((s) => s.trim());
  let match = true;
  if (parts[0]) match = price >= parseInt(parts[0]);
  if (parts[1]) match = match && price <= parseInt(parts[1]);
  return match;
}

function getType(p) {
  if (typeof p.propertyType === "number") {
    return ["Room", "Apartment", "Studio"][p.propertyType] ?? "Room";
  }
  return p.propertyType || p.type || "Room";
}

// ✅ نطاق ديناميكي للبحث الفوري: من الرقم المكتوب لحد أقرب "محطة" ثابتة (مستثناة)
// مثال: 1000 -> [1000, 1999] | 2000 -> [2000, 2999] | 4000 -> [4000, 4999]
const PRICE_STOPS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, Infinity];
function matchesDynamicPrice(p, numQ) {
  const price = parseInt(p.pricePerMonth || p.price || 0);
  const nextStop = PRICE_STOPS.find((s) => s > numQ);
  const upper = nextStop === Infinity ? Infinity : nextStop - 1;
  return price >= numQ && price <= upper;
}

//  بحث فوري 
export function matchesLiveSearch(p, rawQuery, facilitiesMap = {}) {
  const q = (rawQuery || "").trim().toLowerCase();
  if (!q) return true;

  const numQ = parseInt(q);
  const isNumeric = !isNaN(numQ) && /^\d+$/.test(q);

  if (isNumeric) {
    return matchesDynamicPrice(p, numQ);
  }

  const title = p.title || "";
  const location = p.address || p.location || "";
  const type = getType(p);
  const facilityNames = (p.facilities || []).map((id) => facilitiesMap[id]).filter(Boolean).join(" ");
  const haystack = `${title} ${location} ${type} ${facilityNames}`.toLowerCase();
  return haystack.includes(q);
}


export function applyFilters(list, filters, facilitiesMap = {}) {
  return list.filter((p) => {
    const location = p.address || p.location || "";
    const type = getType(p);
    const rooms = p.roomsNumber ?? p.rooms;

    if (filters.location && !location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.propertyType && type.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    if (!matchesPrice(p, filters.priceRange)) return false;
    if (filters.rooms && rooms !== parseInt(filters.rooms)) return false;

    if (filters.facilities?.length > 0) {
      const propFacilityNames = (p.facilities || []).map((id) => facilitiesMap[id]).filter(Boolean);
      if (!filters.facilities.every((f) => propFacilityNames.includes(f))) return false;
    }

    //  بحث فوري 
    if (filters.search?.trim() && !matchesLiveSearch(p, filters.search, facilitiesMap)) return false;

    return true;
  });
}

export function detectSearchIntent(query, allProperties = [], facilitiesMap = {}) {
  const q = query.toLowerCase().trim();
  if (!q) return { filters: EMPTY_FILTERS, matched: false };

  const allLocations = [...new Set(allProperties.map((p) => (p.address || p.location || "").toLowerCase()))];
  const allTypes     = [...new Set(allProperties.map((p) => getType(p).toLowerCase()))];
  const allRooms     = [...new Set(allProperties.map((p) => p.roomsNumber ?? p.rooms))];

  const allFacilityNames = [
    ...new Set(
      allProperties.flatMap((p) => (p.facilities || []).map((id) => facilitiesMap[id]).filter(Boolean))
    )
  ];

  console.log("DEBUG q:", q);
  console.log("DEBUG allLocations:", allLocations);

  const matchedLocation = allLocations.find((loc) => loc.includes(q) || q.includes(loc));
  console.log("DEBUG matchedLocation:", matchedLocation);
  if (matchedLocation) {
    const original = allProperties.find((p) =>
      (p.address || p.location || "").toLowerCase() === matchedLocation
    );
    return { filters: { ...EMPTY_FILTERS, location: original?.address || original?.location || "" }, matched: true };
  }

  const matchedType = allTypes.find((t) => t === q || t.includes(q));
  console.log("DEBUG matchedType:", matchedType);
  if (matchedType) {
    const original = allProperties.find((p) => getType(p).toLowerCase() === matchedType);
    return { filters: { ...EMPTY_FILTERS, propertyType: getType(original) || matchedType }, matched: true };
  }

  const numQ = parseInt(q);
  if (!isNaN(numQ) && allRooms.includes(numQ)) {
    console.log("DEBUG matched rooms");
    return { filters: { ...EMPTY_FILTERS, rooms: String(numQ) }, matched: true };
  }

  if (!isNaN(numQ) && numQ > 10) {
    const STOPS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, Infinity];
    const nextStop = STOPS.find((s) => s > numQ);
    const upper = nextStop === Infinity ? "" : nextStop - 1;
    const dynamicRange = `${numQ}-${upper}`;

    console.log("DEBUG matched dynamic price range:", dynamicRange);
    return { filters: { ...EMPTY_FILTERS, priceRange: dynamicRange }, matched: true };
  }

  const matchedBucket = PRICE_BUCKETS.find((b) => b.label.toLowerCase() === q);
  if (matchedBucket) {
    console.log("DEBUG matched bucket label");
    return { filters: { ...EMPTY_FILTERS, priceRange: matchedBucket.label }, matched: true };
  }

  const matchedFacility = allFacilityNames.find(
    (name) => name.toLowerCase().includes(q) || q.includes(name.toLowerCase())
  );
  console.log("DEBUG matchedFacility:", matchedFacility, "allFacilityNames:", allFacilityNames);
  if (matchedFacility) {
    return { filters: { ...EMPTY_FILTERS, facilities: [matchedFacility] }, matched: true };
  }

  console.log("DEBUG checking titles:", allProperties.map(p => p.title));
  const titleMatches = allProperties.filter((p) => (p.title || "").toLowerCase().includes(q));
  console.log("DEBUG titleMatches:", titleMatches);
  if (titleMatches.length > 0) {
    return { filters: EMPTY_FILTERS, matched: true, titleResults: titleMatches };
  }

  console.log("DEBUG: no match at all, returning matched:false");
  return { filters: EMPTY_FILTERS, matched: false };
}

export function hasAnyFilter(filters) {
  return (
    !!filters.location ||
    !!filters.propertyType ||
    !!filters.priceRange ||
    !!filters.rooms ||
    (filters.facilities?.length > 0) ||
    !!filters.search
  );
}