import React from 'react';
import { Search, Plus, X } from 'lucide-react';
import stepStyles from '../AddPropertyModalSteps.module.css';
import compStyles from '../AddPropertyModalComponents.module.css';

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
      <div className={stepStyles["amenities-section"]}>
        <label className={stepStyles["amenities-label"]}>Amenities *</label>
        
        <div className={stepStyles["amenities-search"]}>
          <Search size={16} className={stepStyles["search-icon"]} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for more Amenities..." 
          />
        </div>

        <div className={stepStyles["amenities-grid"]}>
          {filteredAmenities.map((amenity) => (
            <button 
              key={amenity.name}
              type="button"
              className={`${stepStyles["amenity-btn"]} ${selectedAmenities.includes(amenity.name) ? stepStyles["selected"] : ''}`}
              onClick={() => toggleAmenity(amenity.name)}
            >
              {amenity.icon}
              <span>{amenity.name}</span>
            </button>
          ))}
          
          {searchQuery.trim() !== "" && !exactMatchExists && (
            <button 
              type="button"
              className={`${stepStyles["amenity-btn"]} ${stepStyles["custom-add-btn"]}`}
              onClick={handleAddCustomAmenity}
            >
              <Plus size={18} />
              <span>Add "{searchQuery}"</span>
            </button>
          )}
        </div>
        {errors.amenities && <span className={compStyles["error-text"]}>{errors.amenities}</span>}
      </div>

      <div className={stepStyles["photos-section"]}>
        <label className={stepStyles["amenities-label"]}>Property Photos *</label>
        <div 
          className={`${stepStyles["photo-upload-zone"]} ${errors.photos ? stepStyles["zone-error"] : (photos.length > 0 ? stepStyles["zone-success"] : '')}`} 
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
          <div className={stepStyles["upload-icon-wrapper"]}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={stepStyles["upload-icon"]}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className={stepStyles["upload-title"]}>Drop photos here or click to upload</p>
          <p className={stepStyles["upload-subtitle"]}>Upload up to 10 photos (JPG, PNG - max 5MB each)</p>
        </div>
        {errors.photos && <span className={compStyles["error-text"]}>{errors.photos}</span>}
        
        {photos && photos.length > 0 && (
          <div className={stepStyles["photos-preview"]}>
            {photos.map((photo, index) => (
              <div key={index} className={stepStyles["photo-thumbnail"]}>
                <img src={photo.url} alt={`Property ${index}`} />
                <button type="button" className={stepStyles["remove-photo"]} onClick={(e) => { e.stopPropagation(); removePhoto(index); }}>
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
