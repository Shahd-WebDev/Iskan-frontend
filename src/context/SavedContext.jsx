import { createContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [savedProperties, setSavedProperties] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    if (!token) {
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/SavedProperty/GetSaved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSavedProperties(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [token]);

const toggleSave = async (property) => {
  const exists = savedProperties.some(p => p.id === property.id);

  const url = exists
    ? `/api/SavedProperty/Unsave/${property.id}`
    : `/api/SavedProperty/Save/${property.id}`;

  const method = exists ? "DELETE" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to update saved property");
  }

  if (exists) {
    setSavedProperties(prev =>
      prev.filter(p => p.id !== property.id)
    );
  } else {
    setSavedProperties(prev => [...prev, property]);
  }
};

  const value = {
    savedProperties,
    toggleSave,
    loading,
  };

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  );
}