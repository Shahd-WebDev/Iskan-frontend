import api from "./api";

// 1. Get owner's property listings (owner-scoped, requires auth)
// Supports pagination via PageIndex and PageSize query params
export const getOwnerProperties = async (params = {}) => {
  const response = await api.get("/Property/GetOwnerProperties", { params });
  return response.data;
};

// 2. Get property details by ID
export const getPropertyDetails = async (id) => {
  const response = await api.get("/Property/GetDetails", { params: { id } });
  return response.data;
};

// 3. Get property geolocation coordinates
export const getPropertyLocation = async (id) => {
  const response = await api.get("/Property/GetLocation", { params: { id } });
  return response.data;
};

// 4. Create property (takes FormData for multipart/form-data upload)
// Note: Handled defensively because Swagger indicates the return type is CreatePropertyDto which does not show an ID.
// We check if the response data contains 'id' or if it is a string/contains properties.
export const createProperty = async (formData) => {
  const response = await api.post("/Property/Create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 5. Update property details by ID (takes FormData)
export const updateProperty = async (id, formData) => {
  const response = await api.put(`/Property/Update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 6. Delete property listing by ID
export const deleteProperty = async (id) => {
  const response = await api.delete(`/Property/Delete/${id}`);
  return response.data;
};

// 7. Get images linked to a property
export const getPropertyImages = async (id) => {
  const response = await api.get("/Property/GetImages", { params: { id } });
  return response.data;
};

// 8. Upload one or more photos (takes propertyId in query and FormData with 'Images' files array)
export const addPropertyImages = async (propertyId, formData) => {
  const response = await api.post("/Property/AddImages", formData, {
    params: { propertyId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 9. Remove a single property image by its ID
export const removePropertyImage = async (imageId) => {
  const response = await api.delete("/Property/RemoveImage", { params: { imageId } });
  return response.data;
};

// 10. Clear all images from a property
export const removeAllImages = async (propertyId) => {
  const response = await api.delete("/Property/RemoveAllImages", { params: { id: propertyId } });
  return response.data;
};

// 11. Set cover photo for a property
export const setMainImage = async (propertyId, imageId) => {
  const response = await api.patch("/Property/SetMainImage", null, {
    params: { propertyId, imageId },
  });
  return response.data;
};

// 12. Get documents uploaded for a property
export const getPropertyDocuments = async (id) => {
  const response = await api.get("/Property/GetDocuments", { params: { id } });
  return response.data;
};

// 13. Upload verification document (takes propertyId in query, document File and DocumentType enum)
export const uploadPropertyDocument = async (propertyId, formData) => {
  const response = await api.post("/Property/UploadDocument", formData, {
    params: { propertyId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 14. Delete uploaded verification document
export const removePropertyDocument = async (documentId) => {
  const response = await api.delete("/Property/RemoveDocument", { params: { documentId } });
  return response.data;
};

// 15. Get facilities linked to a property
export const getPropertyFacilities = async (id) => {
  const response = await api.get("/Property/GetFacilities", { params: { id } });
  return response.data;
};

// 16. Bind facilities to a property (takes SetPropertyFacilitiesDto payload)
export const setPropertyFacilities = async (propertyId, facilityIds) => {
  const response = await api.post("/Property/SetFacilities", { facilityIds }, {
    params: { id: propertyId },
  });
  return response.data;
};

// 17. Get all global facilities/amenities registered in the system
export const getAllFacilities = async () => {
  const response = await api.get("/Facility/GetAll");
  return response.data;
};
