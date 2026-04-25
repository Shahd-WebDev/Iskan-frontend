import { createContext, useState } from "react";
import { allProperties } from "../components/data/PropertiesData";

export const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  // Initialize with a slice of mock data to simulate owner's properties
  const [properties, setProperties] = useState(
    allProperties.slice(0, 5).map((p, index) => ({
      ...p,
      name: p.title, // Map 'title' to 'name' as used in owner dashboard
      status: index % 2 === 0 ? "verified" : "pending",
      color: ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DB2777"][p.id % 5]
    }))
  );

  const addProperty = (newProperty) => {
    setProperties(prev => [
      {
        ...newProperty,
        id: Date.now(),
        status: "pending",
        color: "#E2E8F0"
      },
      ...prev
    ]);
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const updateProperty = (updatedProperty) => {
    setProperties(prev => prev.map(p => 
      p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p
    ));
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, deleteProperty, updateProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}
