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
      validFiles.push({ file, name: file.name, url: URL.createObjectURL(file) });
    }
  });

  const updatedPhotos = [...currentPhotos, ...validFiles].slice(0, 10);
  return { updatedPhotos, error };
};

/**
 * Handles document upload logic.
 * @param {Event} e - Input change event
 * @returns {Object} - Object with file object, name and optional error
 */
export const handleDocUploadLogic = (e) => {
  const file = e.target.files[0];
  if (!file) return { file: null, fileName: null, error: null };
  
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/rtf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  if (!validTypes.includes(file.type)) {
    return {
      file: null,
      fileName: null,
      error:
        "Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, RTF, JPG, PNG.",
    };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { file: null, fileName: null, error: "File must be under 10MB" };
  }

  return { file, fileName: file.name, error: null };
};
