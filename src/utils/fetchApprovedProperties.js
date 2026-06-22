/**
 * Fetches all properties from /Property/GetAll, then calls /Property/GetDetails
 * for each one in parallel to retrieve full property details including validation results.
 *
 * Returns properties that are EITHER:
 * 1. Admin-approved: verificationStatus === "Approved", OR
 * 2. AI-approved: ValidationResultJson contains ownershipVerified: true AND no image flags
 *
 * This ensures that both admin-approved and AI-approved properties are visible
 * to students, regardless of whether the backend has auto-updated verificationStatus.
 *
 * @param {string|null} token - Bearer token for authenticated requests
 * @returns {Promise<Array>} Array of fully-detailed, approved properties (admin or AI)
 */
export async function fetchApprovedProperties(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Step 1: get the full list from GetAll
  const listRes = await fetch(`/api/Property/GetAll?pageSize=1000`, { headers });
  if (!listRes.ok) throw new Error("Failed to fetch property list");
  const listData = await listRes.json();
  const properties = listData.data || [];

  if (properties.length === 0) return [];

  // Step 2: call GetDetails for every property in parallel
  const detailResults = await Promise.allSettled(
    properties.map((p) =>
      fetch(`/api/Property/GetDetails?id=${p.id}`, { headers })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  );

  // Helper: Check if validation result indicates successful AI approval
  const isAiApproved = (validationResultJson) => {
    if (!validationResultJson) return false;
    
    let result = validationResultJson;
    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch {
        return false;
      }
    }
    
    // AI-approved if: ownership verified AND no image forensics flags
    const hasImageFlags = result.flags && Array.isArray(result.flags) && result.flags.length > 0;
    return result.ownershipVerified === true && !hasImageFlags;
  };

  // Step 3: merge list data with details, keep only Approved (admin or AI)
  const approved = [];
  detailResults.forEach((result, idx) => {
    const detail = result.status === "fulfilled" ? result.value : null;

    // Prefer detail data; fall back to list data if GetDetails failed
    const merged = detail ? { ...properties[idx], ...detail } : properties[idx];

    // Check admin approval status
    const status = String(
      merged.verificationStatus ||
      merged.VerificationStatus ||
      ""
    ).trim();
    
    const isAdminApproved = status.toLowerCase() === "approved";
    
    // Check AI approval status (from ValidationResultJson)
    const validationResult = 
      merged.validationResultJson ||
      merged.ValidationResultJson ||
      merged.validationResult ||
      merged.ValidationResult;
    const isAiApprovedProperty = isAiApproved(validationResult);
    
    // Include property if either admin-approved OR AI-approved
    if (isAdminApproved || isAiApprovedProperty) {
      approved.push(merged);
    }
  });

  return approved;
}
