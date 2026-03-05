import { createContext, useState } from "react";

export const SavedContext = createContext();

export function SavedProvider({ children }) {

  const [savedProperties, setSavedProperties] = useState([]);

  const toggleSave = (property) => {

    const exists = savedProperties.find(p => p.id === property.id);

    if (exists) {
      setSavedProperties(savedProperties.filter(p => p.id !== property.id));
    } else {
      setSavedProperties([...savedProperties, property]);
    }

  };

  return (
    <SavedContext.Provider value={{ savedProperties, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
}