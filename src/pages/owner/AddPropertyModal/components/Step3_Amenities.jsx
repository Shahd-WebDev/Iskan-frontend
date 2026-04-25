import React from 'react';
import { Search, Plus, X } from 'lucide-react';

const Step3_Amenities = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredAmenities, 
  selectedAmenities, 
  toggleAmenity, 
  exactMatchExists, 
  handleAddCustomAmenity, 
  errors, 
  handlePhotoUpload, 
  removePhoto, 
  photos, 
  touched 
}) => {
  return (
    <>
      <div className="amenities-section">
        <label className="amenities-label">Amenities *</label>
        
        <div className="amenities-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for more Amenities..." 
          />
        </div>

        <div className="amenities-grid">
          {filteredAmenities.map((amenity) => (
            <button 
              key={amenity.name}
              type="button"
              className={`amenity-btn ${selectedAmenities.includes(amenity.name) ? 'selected' : ''}`}
              onClick={() => toggleAmenity(amenity.name)}
            >
              {amenity.icon}
              <span>{amenity.name}</span>
            </button>
          ))}
          
          {searchQuery.trim() !== "" && !exactMatchExists && (
            <button 
              type="button"
              className="amenity-btn custom-add-btn"
              onClick={handleAddCustomAmenity}
            >
              <Plus size={18} />
              <span>Add "{searchQuery}"</span>
            </button>
          )}
        </div>
        {errors.amenities && <span className="error-text">{errors.amenities}</span>}
      </div>

      <div className="photos-section">
        <label className="amenities-label">Property Photos *</label>
        <div 
          className={`photo-upload-zone ${errors.photos ? 'zone-error' : (photos.length > 0 ? 'zone-success' : '')}`} 
          onClick={() => document.getElementById('photo-upload').click()}
        >
          <input 
            type="file" 
            id="photo-upload" 
            multiple 
            accept="image/jpeg, image/png, image/jpg" 
            style={{display: 'none'}} 
            onChange={handlePhotoUpload}
          />
          <div className="upload-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className="upload-title">Drop photos here or click to upload</p>
          <p className="upload-subtitle">Upload up to 10 photos (JPG, PNG - max 5MB each)</p>
        </div>
        {errors.photos && <span className="error-text">{errors.photos}</span>}
        
        {photos && photos.length > 0 && (
          <div className="photos-preview">
            {photos.map((photo, index) => (
              <div key={index} className="photo-thumbnail">
                <img src={photo.url} alt={`Property ${index}`} />
                <button type="button" className="remove-photo" onClick={(e) => { e.stopPropagation(); removePhoto(index); }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Step3_Amenities;
