import { useState, useCallback, useContext } from "react";
import { Wifi, Car, Wind, Utensils, Waves, Dumbbell, Tv, Droplet, Plus } from "lucide-react";

// Components
import ModalHeader from "./components/ModalHeader";
import ModalFooter from "./components/ModalFooter";
import SuccessState from "./components/SuccessState";
import Step1_BasicInfo from "./components/Step1_BasicInfo";
import Step2_Details from "./components/Step2_Details";
import Step3_Amenities from "./components/Step3_Amenities";
import Step4_Verification from "./components/Step4_Verification";

// Context
import { PropertyContext } from "../../../../context/PropertyContext";

// Utils
import { validateField, validateAll } from "./utils/validation";
import { handlePhotoUploadLogic, handleDocUploadLogic } from "./utils/formHandlers";

// Styles
import styles from "./AddPropertyModal.module.css";
window.addPropertyStyles = styles; // For subcomponents if needed, or just pass as props

const defaultAmenitiesList = [
  { name: "WiFi", icon: <Wifi size={18} /> },
  { name: "Parking", icon: <Car size={18} /> },
  { name: "Air Conditioning", icon: <Wind size={18} /> },
  { name: "Kitchen", icon: <Utensils size={18} /> },
  { name: "Swimming Pool", icon: <Waves size={18} /> },
  { name: "Gym", icon: <Dumbbell size={18} /> },
  { name: "TV", icon: <Tv size={18} /> },
  { name: "Water Heater", icon: <Droplet size={18} /> }
];

export default function AddPropertyModal({ onClose, propertyToEdit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addProperty, updateProperty } = useContext(PropertyContext);
  
  // Form State
  const [formData, setFormData] = useState({
    propertyName: propertyToEdit?.name || "",
    propertyType: propertyToEdit?.type || "",
    streetAddress: propertyToEdit?.location?.split(",")[1]?.trim() || "", // Simple mapping
    city: propertyToEdit?.location?.split(",")[0]?.trim() || "",
    state: "",
    country: "Egypt",
    zipCode: "",
    description: propertyToEdit?.description || "",
    bedrooms: propertyToEdit?.rooms || "",
    bathrooms: propertyToEdit?.bathrooms || "",
    sqft: "",
    price: propertyToEdit?.price?.replace(" EGP", "") || "",
    availableFrom: "",
    photos: propertyToEdit?.image ? [propertyToEdit.image] : [],
    titleDeed: null,
    taxLicense: null,
    utilityBill: null,
    location: { lat: propertyToEdit?.lat || null, lng: propertyToEdit?.lng || null },
    isLocationSelected: !!propertyToEdit?.lat
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Amenities State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState(propertyToEdit?.amenities || []);
  const [customAmenities, setCustomAmenities] = useState([]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value, formData);
      setErrors(prev => ({ ...prev, [name]: error }));
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleLocationSelect = useCallback((lat, lng, address, details) => {
    setFormData(prev => ({
      ...prev,
      streetAddress: address,
      city: details.city || prev.city,
      state: details.state || prev.state,
      country: details.country || prev.country,
      zipCode: details.zipCode || prev.zipCode,
      location: { lat, lng },
      isLocationSelected: true
    }));

    const clearFields = ["streetAddress", "city", "state", "country", "zipCode"];
    setErrors(prev => {
      const newErrors = { ...prev };
      clearFields.forEach(f => newErrors[f] = null);
      return newErrors;
    });

    setTouched(prev => {
      const newTouched = { ...prev };
      clearFields.forEach(f => newTouched[f] = true);
      return newTouched;
    });
  }, []);

  const handleNext = () => {
    if (currentStep === 4) {
      const { errors: newErrors, firstErrorStep } = validateAll(formData, selectedAmenities);
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), { amenities: true, photos: true }));

      if (firstErrorStep) {
        setCurrentStep(firstErrorStep);
        setTimeout(() => {
          const firstErrorEl = document.querySelector('[class*="input-error"], [class*="error-text"], [class*="zone-error"]');
          if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        // Prepare data for submission
        const propertyData = {
          name: formData.propertyName,
          location: `${formData.city}${formData.state ? `, ${formData.state}` : ""}`,
          description: formData.description,
          amenities: selectedAmenities,
          price: formData.price ? `${formData.price} EGP` : "",
          type: formData.propertyType,
          rooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          lat: formData.location.lat,
          lng: formData.location.lng,
        };

        if (propertyToEdit) {
          updateProperty({ ...propertyToEdit, ...propertyData });
        } else {
          addProperty(propertyData);
        }
        setIsSubmitted(true);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- Photos Handlers ---
  const handlePhotoUpload = (e) => {
    const { updatedPhotos, error } = handlePhotoUploadLogic(e, formData.photos);
    if (error) setErrors(prev => ({ ...prev, photos: error }));
    else setErrors(prev => ({ ...prev, photos: null }));
    
    setFormData(prev => ({ ...prev, photos: updatedPhotos }));
  };

  const removePhoto = (index) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, photos: updatedPhotos }));
    if (updatedPhotos.length === 0 && touched.photos) {
      setErrors(prev => ({ ...prev, photos: "Please upload at least one photo" }));
    }
  };

  // --- Docs Handlers ---
  const handleDocUpload = (fieldName, e) => {
    const { fileName, error } = handleDocUploadLogic(e);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    } else if (fileName) {
      setFormData(prev => ({ ...prev, [fieldName]: fileName }));
      setErrors(prev => ({ ...prev, [fieldName]: null }));
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    }
  };

  // --- Amenities Logic ---
  const toggleAmenity = (amenityName) => {
    setSelectedAmenities(prev => {
      const newValue = prev.includes(amenityName) ? prev.filter(a => a !== amenityName) : [...prev, amenityName];
      if (newValue.length > 0 && errors.amenities) setErrors(e => ({ ...e, amenities: null }));
      return newValue;
    });
  };

  const combinedAmenitiesList = [...defaultAmenitiesList, ...customAmenities];
  const filteredAmenities = combinedAmenitiesList.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const exactMatchExists = combinedAmenitiesList.some(a => 
    a.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const handleAddCustomAmenity = () => {
    if (!searchQuery.trim()) return;
    const newAmenity = { name: searchQuery.trim(), icon: <Plus size={18} /> };
    setCustomAmenities(prev => [...prev, newAmenity]);
    toggleAmenity(newAmenity.name);
    setSearchQuery("");
  };

  // --- Success Render ---
  if (isSubmitted) {
    return (
      <div className={styles["modal-backdrop"]}>
        <SuccessState onClose={onClose} />
      </div>
    );
  }

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles["modal-container"]}>
        <ModalHeader 
          title={propertyToEdit ? "Edit Property" : "Add New Property"} 
          currentStep={currentStep} 
          totalSteps={4} 
          onClose={onClose} 
        />

        <div className={styles["modal-stepper"]}>
          {["Basic Info", "Details", "Amenities", "Verification"].map((label, idx) => (
            <div key={idx} className={`${styles["step"]} ${currentStep >= idx + 1 ? styles["active"] : ''}`}>
              <div className={styles["step-bar"]}></div>
              <span className={styles["step-label"]}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles["modal-body"]}>
          {currentStep === 1 && (
            <Step1_BasicInfo 
              formData={formData} 
              errors={errors} 
              touched={touched} 
              handleChange={handleChange} 
              handleBlur={handleBlur} 
              onLocationSelect={handleLocationSelect} 
            />
          )}

          {currentStep === 2 && (
            <Step2_Details 
              formData={formData} 
              errors={errors} 
              touched={touched} 
              handleChange={handleChange} 
              handleBlur={handleBlur} 
            />
          )}

          {currentStep === 3 && (
            <Step3_Amenities 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredAmenities={filteredAmenities}
              selectedAmenities={selectedAmenities}
              toggleAmenity={toggleAmenity}
              exactMatchExists={exactMatchExists}
              handleAddCustomAmenity={handleAddCustomAmenity}
              errors={errors}
              handlePhotoUpload={handlePhotoUpload}
              removePhoto={removePhoto}
              photos={formData.photos}
              touched={touched}
            />
          )}

          {currentStep === 4 && (
            <Step4_Verification 
              formData={formData} 
              errors={errors} 
              handleDocUpload={handleDocUpload} 
            />
          )}
        </div>

        <ModalFooter 
          currentStep={currentStep} 
          totalSteps={4} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      </div>
    </div>
  );
}
