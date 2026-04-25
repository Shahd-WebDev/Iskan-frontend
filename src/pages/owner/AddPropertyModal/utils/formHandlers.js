/**
 * Handles photo upload logic.
 * @param {Event} e - Input change event
 * @param {Array} currentPhotos - Current list of photos
 * @returns {Object} - Object with new photos and optional error
 */
export const handlePhotoUploadLogic = (e, currentPhotos = []) => {
  const files = Array.from(e.target.files);
  let error = null;
  let validFiles = [];

  files.forEach(file => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      error = "Only JPG and PNG files are allowed";
    } else if (file.size > 5 * 1024 * 1024) {
      error = "Each photo must be under 5MB";
    } else {
      validFiles.push({ name: file.name, url: URL.createObjectURL(file) });
    }
  });

  const updatedPhotos = [...currentPhotos, ...validFiles].slice(0, 10);
  return { updatedPhotos, error };
};

/**
 * Handles document upload logic.
 * @param {Event} e - Input change event
 * @returns {Object} - Object with file name and optional error
 */
export const handleDocUploadLogic = (e) => {
  const file = e.target.files[0];
  if (!file) return { fileName: null, error: null };
  
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { fileName: null, error: "Invalid file type (PDF, JPG, PNG only)" };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { fileName: null, error: "File must be under 10MB" };
  }

  return { fileName: file.name, error: null };
};
