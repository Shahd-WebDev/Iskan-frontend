import { useState, useCallback, useEffect } from "react";
import {
  Wifi,
  Car,
  Wind,
  Utensils,
  Waves,
  Dumbbell,
  Tv,
  Droplet,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Components
import ModalHeader from "./components/ModalHeader";
import ModalFooter from "./components/ModalFooter";
import SuccessState from "./components/SuccessState";
import Step1_BasicInfo from "./components/Step1_BasicInfo";
import Step2_Details from "./components/Step2_Details";
import Step3_Amenities from "./components/Step3_Amenities";
import Step4_Verification from "./components/Step4_Verification";

// Services
import {
  createProperty,
  updateProperty as updatePropertyApi,
  addPropertyImages,
  removePropertyImage,
  uploadPropertyDocument,
  setPropertyFacilities,
  getPropertyFacilities,
  getAllFacilities,
  createFacility,
  getPropertyDetails,
  getPropertyLocation,
  getPropertyImages,
  getPropertyDocuments,
  setMainImage,
} from "../../../../services/ownerProperties";
import toast from "react-hot-toast";

// Utils
import { validateField, validateAll } from "./utils/validation";
import {
  handlePhotoUploadLogic,
  handleDocUploadLogic,
} from "./utils/formHandlers";

// Styles
import styles from "./AddPropertyModal.module.css";
window.addPropertyStyles = styles;

const defaultAmenitiesList = [
  { name: "WiFi", icon: <Wifi size={18} /> },
  { name: "Parking", icon: <Car size={18} /> },
  { name: "Air Conditioning", icon: <Wind size={18} /> },
  { name: "Kitchen", icon: <Utensils size={18} /> },
  { name: "Swimming Pool", icon: <Waves size={18} /> },
  { name: "Gym", icon: <Dumbbell size={18} /> },
  { name: "TV", icon: <Tv size={18} /> },
  { name: "Water Heater", icon: <Droplet size={18} /> },
];

const getAmenityIcon = (iconName) => {
  const name = iconName?.toLowerCase() || "";
  if (name.includes("wifi")) return <Wifi size={18} />;
  if (name.includes("parking") || name.includes("car"))
    return <Car size={18} />;
  if (name.includes("air") || name.includes("wind") || name.includes("ac"))
    return <Wind size={18} />;
  if (
    name.includes("kitchen") ||
    name.includes("utensil") ||
    name.includes("food")
  )
    return <Utensils size={18} />;
  if (name.includes("pool") || name.includes("wave") || name.includes("swim"))
    return <Waves size={18} />;
  if (name.includes("gym") || name.includes("dumb"))
    return <Dumbbell size={18} />;
  if (name.includes("tv")) return <Tv size={18} />;
  if (
    name.includes("water") ||
    name.includes("drop") ||
    name.includes("heater")
  )
    return <Droplet size={18} />;
  return <Plus size={18} />;
};

const buildUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://isskan-1.runasp.net${url}`;
};

const normalizeArrayResponse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data?.items)) return data.data.items;
  return [];
};

const extractDocumentName = (document) => {
  if (!document) return null;
  return (
    document.fileName ||
    document.documentName ||
    document.name ||
    document.title ||
    (typeof document === "string" ? document : null)
  );
};

export default function AddPropertyModal({ onClose, propertyToEdit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Dynamic Facilities list
  const [facilities, setFacilities] = useState([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);

  // Edit pre-fill loading
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    propertyName: propertyToEdit?.title || "",
    propertyType: propertyToEdit?.propertyType || "",
    streetAddress: propertyToEdit?.address || "",
    city: "",
    state: "",
    country: "Egypt",
    zipCode: "",
    description: propertyToEdit?.description || "",
    rooms: propertyToEdit?.roomsNumber || "",
    bedrooms:
      propertyToEdit?.bedroomsNumber || propertyToEdit?.roomsNumber || "",
    bathrooms: propertyToEdit?.bathroomsNumber || "",
    sqft: "",
    price: propertyToEdit?.pricePerMonth
      ? String(propertyToEdit.pricePerMonth)
      : "",
    availableFrom: "",
    photos: [],
    mainPhotoIndex: null,
    titleDeed: null,
    taxLicense: null,
    utilityBill: null,
    location: { lat: null, lng: null },
    isLocationSelected: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Amenities State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenities, setCustomAmenities] = useState([]);

  // Track removed images for edit flow
  const [removedImageIds, setRemovedImageIds] = useState([]);

  // --- Initial Data Loading ---
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setFacilitiesLoading(true);
        const data = await getAllFacilities();
        const facilitiesList = Array.isArray(data)
          ? data
          : data?.data || data?.result || [];
        const mapped = facilitiesList.map((f) => ({
          id: f.id,
          name: f.name || f.facilityName,
          icon: getAmenityIcon(f.icon),
        }));
        setFacilities(mapped);
      } catch (err) {
        console.error("Failed to load facilities:", err);
        setFacilities(defaultAmenitiesList.map((a) => ({ ...a, id: a.name })));
      } finally {
        setFacilitiesLoading(false);
      }
    };
    loadFacilities();
  }, []);

  useEffect(() => {
    if (!propertyToEdit) return;

    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        setDetailsError(null);

        // Fetch full property details and assets separately so we can display persisted images/documents
        const [details, rawImages, rawDocuments] = await Promise.all([
          getPropertyDetails(propertyToEdit.id),
          getPropertyImages(propertyToEdit.id),
          getPropertyDocuments(propertyToEdit.id),
        ]);

        const existingImages = normalizeArrayResponse(rawImages);
        const existingDocuments = normalizeArrayResponse(rawDocuments);

        const titleDeedDoc = existingDocuments.find(
          (d) => d.documentType === "OwnershipContract",
        );
        const taxLicenseDoc = existingDocuments.find(
          (d) => d.documentType === "TaxCertificate",
        );
        const utilityBillDoc = existingDocuments.find(
          (d) => d.documentType === "UtilityBill" || d.documentType === "Other",
        );

        const facilityData = await getPropertyFacilities(propertyToEdit.id);
        const existingFacilities = normalizeArrayResponse(facilityData);

        const mainPhotoIndex = existingImages.findIndex((img) => img.isMain);

        // Populate form data
        setFormData((prev) => ({
          ...prev,
          propertyName: details.title || "",
          propertyType: details.propertyType || "",
          streetAddress: details.address || "",
          description: details.description || "",
          rooms: details.roomsNumber || "",
          bedrooms: details.bedroomsNumber || "",
          bathrooms: details.bathroomsNumber || "",
          price: details.pricePerMonth ? String(details.pricePerMonth) : "",
          photos: existingImages.map((img) => ({
            id: img.id,
            url: buildUrl(img.imageUrl || img.url),
            isMain: img.isMain,
            isExisting: true,
          })),
          mainPhotoIndex:
            mainPhotoIndex >= 0
              ? mainPhotoIndex
              : existingImages.length > 0
                ? 0
                : null,
          titleDeed: extractDocumentName(titleDeedDoc),
          taxLicense: extractDocumentName(taxLicenseDoc),
          utilityBill: extractDocumentName(utilityBillDoc),
        }));

        if (existingFacilities.length > 0) {
          const names = existingFacilities.map(
            (f) => f.facilityName || f.name || f,
          );
          setSelectedAmenities(names);
        } else if (details.facilities) {
          const names = details.facilities.map((f) => f.facilityName || f.name);
          setSelectedAmenities(names);
        }

        try {
          const loc = await getPropertyLocation(propertyToEdit.id);
          if (loc) {
            setFormData((prev) => ({
              ...prev,
              location: { lat: loc.latitude, lng: loc.longitude },
              isLocationSelected: true,
            }));
          }
        } catch (locErr) {
          console.error(
            "Failed to fetch property location coordinates:",
            locErr,
          );
        }
      } catch (err) {
        console.error("Failed to load property details:", err);
        setDetailsError(
          "Failed to load property details. Please close and try again.",
        );
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [propertyToEdit]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value, formData);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleLocationSelect = useCallback((lat, lng, address, details) => {
    setFormData((prev) => ({
      ...prev,
      streetAddress: address,
      city: details.city || prev.city,
      state: details.state || prev.state,
      country: details.country || prev.country,
      zipCode: details.zipCode || prev.zipCode,
      location: { lat, lng },
      isLocationSelected: true,
    }));

    const clearFields = [
      "streetAddress",
      "city",
      "state",
      "country",
      "zipCode",
    ];
    setErrors((prev) => {
      const newErrors = { ...prev };
      clearFields.forEach((f) => (newErrors[f] = null));
      return newErrors;
    });

    setTouched((prev) => {
      const newTouched = { ...prev };
      clearFields.forEach((f) => (newTouched[f] = true));
      return newTouched;
    });
  }, []);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Validate everything
      const { errors: newErrors, firstErrorStep } = validateAll(
        formData,
        selectedAmenities,
      );
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {
          amenities: true,
          photos: true,
        }),
      );

      if (firstErrorStep) {
        setCurrentStep(firstErrorStep);
        setTimeout(() => {
          const firstErrorEl = document.querySelector(
            '[class*="input-error"], [class*="error-text"], [class*="zone-error"]',
          );
          if (firstErrorEl)
            firstErrorEl.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 100);
        return;
      }

      // If valid, submit to API
      try {
        setSubmitting(true);
        setSubmitError(null);

        // Map facilities names to IDs
        const selectedIds = selectedAmenities
          .map((name) => {
            const found = facilities.find(
              (f) => f.name.toLowerCase() === name.toLowerCase(),
            );
            return found?.id;
          })
          .filter(Boolean);

        if (propertyToEdit) {
          // UPDATE FLOW
          const updateData = new FormData();
          updateData.append("Title", formData.propertyName);
          updateData.append("Address", formData.streetAddress);
          updateData.append("Description", formData.description);
          updateData.append("RoomsNumber", Number(formData.rooms));
          updateData.append("BedroomsNumber", Number(formData.bedrooms));
          updateData.append("BathroomsNumber", Number(formData.bathrooms));
          updateData.append("PricePerMonth", Number(formData.price));

          await updatePropertyApi(propertyToEdit.id, updateData);

          // Upload new images & set main if new images were added
          const newImages = formData.photos
            .filter((p) => !p.isExisting && p.file)
            .map((p) => p.file);
          if (newImages.length > 0) {
            const imagesFormData = new FormData();
            newImages.forEach((img) => imagesFormData.append("Images", img));
            const uploadResult = await addPropertyImages(
              propertyToEdit.id,
              imagesFormData,
            );
            const uploadedImages = normalizeArrayResponse(uploadResult);

            // Set main image using the selected photo, or fallback to first uploaded image
            const mainImageId = resolveMainImageId(
              formData.photos,
              formData.mainPhotoIndex,
              uploadedImages,
            );
            if (mainImageId) {
              await setMainImage(propertyToEdit.id, mainImageId);
            }
          } else if (formData.mainPhotoIndex != null) {
            const selectedPhoto = formData.photos[formData.mainPhotoIndex];
            if (selectedPhoto?.id) {
              await setMainImage(propertyToEdit.id, selectedPhoto.id);
            }
          }

          // Delete removed images
          for (const imgId of removedImageIds) {
            await removePropertyImage(imgId);
          }

          // Upload new documents if modified
          if (formData.titleDeed?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.titleDeed.file);
            docFormData.append("DocumentType", "OwnershipContract");
            await uploadPropertyDocument(propertyToEdit.id, docFormData);
          }
          if (formData.taxLicense?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.taxLicense.file);
            docFormData.append("DocumentType", "TaxCertificate");
            await uploadPropertyDocument(propertyToEdit.id, docFormData);
          }
          if (formData.utilityBill?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.utilityBill.file);
            docFormData.append("DocumentType", "Other");
            await uploadPropertyDocument(propertyToEdit.id, docFormData);
          }

          // Update facilities/amenities
          await setPropertyFacilities(propertyToEdit.id, selectedIds);
        } else {
          // CREATE FLOW
          const createData = new FormData();
          createData.append("Title", formData.propertyName);
          createData.append(
            "Address",
            formData.streetAddress || `${formData.city}, ${formData.state}`,
          );
          createData.append("Description", formData.description);
          createData.append("PropertyType", formData.propertyType);
          createData.append("RoomsNumber", Number(formData.rooms));
          createData.append("BedroomsNumber", Number(formData.bedrooms));
          createData.append("BathroomsNumber", Number(formData.bathrooms));
          createData.append("PricePerMonth", Number(formData.price));
          if (formData.location.lat) {
            createData.append("Latitude", Number(formData.location.lat));
            createData.append("Longitude", Number(formData.location.lng));
          }

          const createdResponse = await createProperty(createData);
          // Handle Swagger contract missing ID defensively
          const createdProperty =
            createdResponse?.property || createdResponse?.data?.property;
          const propertyId =
            createdResponse?.id ||
            createdResponse?.Id ||
            createdProperty?.id ||
            createdProperty?.Id ||
            createdResponse?.data?.id ||
            createdResponse;

          if (!propertyId || typeof propertyId !== "string") {
            throw new Error(
              `Created property ID was not returned by the API. Response structure was: ${JSON.stringify(createdResponse)}`,
            );
          }

          // Upload Images & set main image
          const newImages = formData.photos
            .filter((p) => p.file)
            .map((p) => p.file);
          if (newImages.length > 0) {
            const imagesFormData = new FormData();
            newImages.forEach((img) => imagesFormData.append("Images", img));
            const uploadResult = await addPropertyImages(
              propertyId,
              imagesFormData,
            );
            const uploadedImages = normalizeArrayResponse(uploadResult);

            try {
              const mainImageId = resolveMainImageId(
                formData.photos,
                formData.mainPhotoIndex,
                uploadedImages,
              );
              if (mainImageId) {
                await setMainImage(propertyId, mainImageId);
              }
            } catch (setMainErr) {
              console.warn("Could not set main image:", setMainErr);
            }
          } else if (formData.mainPhotoIndex != null) {
            const selectedPhoto = formData.photos[formData.mainPhotoIndex];
            if (selectedPhoto?.id) {
              try {
                await setMainImage(propertyId, selectedPhoto.id);
              } catch (setMainErr) {
                console.warn("Could not set main image:", setMainErr);
              }
            }
          }

          // Upload Documents
          if (formData.titleDeed?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.titleDeed.file);
            docFormData.append("DocumentType", "OwnershipContract");
            await uploadPropertyDocument(propertyId, docFormData);
          }
          if (formData.taxLicense?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.taxLicense.file);
            docFormData.append("DocumentType", "TaxCertificate");
            await uploadPropertyDocument(propertyId, docFormData);
          }
          if (formData.utilityBill?.file) {
            const docFormData = new FormData();
            docFormData.append("Document", formData.utilityBill.file);
            docFormData.append("DocumentType", "Other");
            await uploadPropertyDocument(propertyId, docFormData);
          }

          // Bind Facilities
          if (selectedIds.length > 0) {
            await setPropertyFacilities(propertyId, selectedIds);
          }
        }

        setIsSubmitted(true);
      } catch (err) {
        console.error("Submission failed:", err);
        setSubmitError(
          err.message ||
            "Failed to submit property. Please verify your connection and try again.",
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Photos Handlers ---
  const handlePhotoUpload = (e) => {
    const { updatedPhotos, error } = handlePhotoUploadLogic(e, formData.photos);
    if (error) setErrors((prev) => ({ ...prev, photos: error }));
    else setErrors((prev) => ({ ...prev, photos: null }));

    setFormData((prev) => {
      const normalizedPhotos = updatedPhotos.map((p) => ({
        ...p,
        isExisting: !!p.id,
        isMain: !!p.isMain,
      }));
      const hasMain =
        typeof prev.mainPhotoIndex === "number" &&
        prev.mainPhotoIndex >= 0 &&
        prev.mainPhotoIndex < normalizedPhotos.length;

      return {
        ...prev,
        photos: normalizedPhotos,
        mainPhotoIndex: hasMain
          ? prev.mainPhotoIndex
          : normalizedPhotos.length > 0
            ? 0
            : null,
      };
    });
  };

  const removePhoto = (index) => {
    const photoToRemove = formData.photos[index];
    if (photoToRemove.isExisting && photoToRemove.id) {
      // Add to removed IDs to call API on final submit
      setRemovedImageIds((prev) => [...prev, photoToRemove.id]);
    }

    setFormData((prev) => {
      const updatedPhotos = prev.photos.filter((_, i) => i !== index);
      let updatedMainIndex = prev.mainPhotoIndex;
      if (updatedMainIndex === index) {
        updatedMainIndex = updatedPhotos.length > 0 ? 0 : null;
      } else if (updatedMainIndex > index) {
        updatedMainIndex = updatedMainIndex - 1;
      }
      return {
        ...prev,
        photos: updatedPhotos,
        mainPhotoIndex: updatedMainIndex,
      };
    });

    if (formData.photos.length === 1 && touched.photos) {
      setErrors((prev) => ({
        ...prev,
        photos: "Please upload at least one photo",
      }));
    }
  };

  const selectMainPhoto = (index) => {
    setFormData((prev) => ({ ...prev, mainPhotoIndex: index }));
  };

  const resolveMainImageId = (photos, mainPhotoIndex, uploadedImages = []) => {
    if (
      mainPhotoIndex == null ||
      mainPhotoIndex < 0 ||
      mainPhotoIndex >= photos.length
    ) {
      return null;
    }
    const selected = photos[mainPhotoIndex];
    if (!selected) return null;
    if (selected.id) return selected.id;

    const candidateName = selected.fileName || selected.name;
    if (
      candidateName &&
      Array.isArray(uploadedImages) &&
      uploadedImages.length > 0
    ) {
      const matched = uploadedImages.find(
        (img) =>
          img.id &&
          (img.fileName === candidateName ||
            img.documentName === candidateName ||
            String(img.imageUrl || img.url || "").includes(candidateName)),
      );
      if (matched) return matched.id;
    }

    return Array.isArray(uploadedImages) && uploadedImages.length > 0
      ? uploadedImages[0].id
      : null;
  };

  // --- Docs Handlers ---
  const handleDocUpload = (fieldName, e) => {
    const { file, fileName, error } = handleDocUploadLogic(e);
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
    } else if (fileName) {
      setFormData((prev) => ({ ...prev, [fieldName]: { file, fileName } }));
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  // --- Amenities Logic ---
  const toggleAmenity = (amenityName) => {
    setSelectedAmenities((prev) => {
      const newValue = prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName];
      if (newValue.length > 0 && errors.amenities)
        setErrors((e) => ({ ...e, amenities: null }));
      return newValue;
    });
  };

  const combinedAmenitiesList =
    facilities.length > 0 ? facilities : defaultAmenitiesList;
  const filteredAmenities = combinedAmenitiesList.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const exactMatchExists = combinedAmenitiesList.some(
    (a) => a.name.toLowerCase() === searchQuery.trim().toLowerCase(),
  );

  const handleAddCustomAmenity = async () => {
    const trimmedName = searchQuery.trim();
    if (!trimmedName) return;

    const existingFacility = facilities.find(
      (f) => f.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existingFacility) {
      if (!selectedAmenities.includes(existingFacility.name)) {
        toggleAmenity(existingFacility.name);
      }
      setSearchQuery("");
      return;
    }

    try {
      const createResult = await createFacility({ name: trimmedName });
      const createdFacility =
        createResult?.facility ||
        createResult?.data?.facility ||
        createResult?.data ||
        createResult ||
        {};
      const facilityId =
        createdFacility?.id || createdFacility?.Id || createdFacility;
      const facilityName =
        createdFacility?.name || createdFacility?.facilityName || trimmedName;

      const newFacility = {
        id: facilityId,
        name: facilityName,
        icon: <Plus size={18} />,
      };

      setFacilities((prev) => [...prev, newFacility]);
      setCustomAmenities((prev) => [...prev, newFacility]);
      if (!selectedAmenities.includes(facilityName)) {
        setSelectedAmenities((prev) => [...prev, facilityName]);
      }
      setSearchQuery("");
    } catch (err) {
      console.error("Failed to create custom amenity:", err);
      toast.error("Unable to add custom amenity. Please try again.");
    }
  };

  // --- Success Render ---
  if (isSubmitted) {
    return (
      <div className={styles["modal-backdrop"]}>
        <SuccessState onClose={onClose} />
      </div>
    );
  }

  const isApproved = propertyToEdit?.verificationStatus === "Approved";

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles["modal-container"]}>
        <ModalHeader
          title={propertyToEdit ? "Edit Property" : "Add New Property"}
          currentStep={currentStep}
          totalSteps={4}
          onClose={onClose}
        />

        {/* --- Verification Re-review Warning Banner --- */}
        {isApproved && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#FFFBEB",
              borderLeft: "4px solid #F59E0B",
              padding: "12px 24px",
              margin: "0 32px 16px 32px",
              borderRadius: "6px",
            }}
          >
            <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: "13px",
                color: "#B45309",
                fontWeight: "500",
                lineHeight: "1.4",
              }}
            >
              <strong>Notice:</strong> Edits to an approved property will revert
              its verification status to <strong>Pending review</strong> until
              our team reviews the changes.
            </span>
          </div>
        )}

        {/* Load Errors / Details Errors */}
        {detailsError && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              color: "#EF4444",
              padding: "12px 24px",
              margin: "0 32px 16px 32px",
              backgroundColor: "#FEE2E2",
              borderRadius: "6px",
              fontSize: "14px",
              alignItems: "center",
            }}
          >
            <AlertCircle size={18} />
            <span>{detailsError}</span>
          </div>
        )}

        {submitError && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              color: "#EF4444",
              padding: "12px 24px",
              margin: "0 32px 16px 32px",
              backgroundColor: "#FEE2E2",
              borderRadius: "6px",
              fontSize: "14px",
              alignItems: "center",
            }}
          >
            <AlertCircle size={18} />
            <span>{submitError}</span>
          </div>
        )}

        {loadingDetails ? (
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            <RefreshCw
              size={32}
              className={styles["spinner"]}
              style={{
                animation: "spin 1.5s linear infinite",
                color: "#0088FF",
                marginBottom: "12px",
              }}
            />
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              Loading property details...
            </p>
          </div>
        ) : (
          <>
            <div className={styles["modal-stepper"]}>
              {[
                "Basic Info",
                "Location",
                "Images & Facilities",
                "Verification",
              ].map((label, idx) => (
                <div
                  key={idx}
                  className={`${styles["step"]} ${currentStep >= idx + 1 ? styles["active"] : ""}`}
                >
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
                />
              )}

              {currentStep === 2 && (
                <Step2_Details
                  formData={formData}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  onLocationSelect={handleLocationSelect}
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
                  mainPhotoIndex={formData.mainPhotoIndex}
                  selectMainPhoto={selectMainPhoto}
                  facilitiesLoading={facilitiesLoading}
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
              submitting={submitting}
            />
          </>
        )}
      </div>
    </div>
  );
}
