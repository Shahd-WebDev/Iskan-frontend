import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
} from "../services/settings";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiGetProfile();
      if (data && data.profileImageUrl) {
        data.profileImageUrl = normalizeImageUrl(data.profileImageUrl);
      }
      setProfile(data || null);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch profile when token changes (on login / reload)
    if (token) fetchProfile();
    else setProfile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateProfile = async ({
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    profileImageFile,
  }) => {
    try {
      const formData = new FormData();
      if (firstName !== undefined) formData.append("FirstName", firstName);
      if (lastName !== undefined) formData.append("LastName", lastName);
      if (dateOfBirth !== undefined)
        formData.append("DateOfBirth", dateOfBirth);
      if (phoneNumber !== undefined)
        formData.append("PhoneNumber", phoneNumber);
      if (profileImageFile) formData.append("ProfileImage", profileImageFile);

      const res = await apiUpdateProfile(formData);

      // After successful update, refresh profile from API
      await fetchProfile();

      // If backend returns a message, show it
      if (res?.message) {
        toast.success(res.message);
      } else {
        toast.success("Profile updated successfully.");
      }

      return res;
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err?.message || "Failed to update profile.");
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loading, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export default ProfileContext;
