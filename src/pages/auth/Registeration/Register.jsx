import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";

import RoleStep from "./steps/RoleStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import OwnerVerificationStep from "./steps/OwnerVerificationStep";
import SuccessStep from "./steps/SuccessStep";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [googlePrefill, setGooglePrefill] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const updateData = (data) =>
    setFormData((prev) => ({ ...prev, ...data }));

  // =========================
  // BUILD PAYLOAD
  // =========================
  const buildPayload = () => ({
    role: role === "owner" ? "Owner" : "Student",
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender
      ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)
      : null,
  });

  // =========================
  // REGISTER API
  // =========================
  const callRegisterApi = async () => {
    const response = await fetch("/api/Authentication/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    const text = await response.text();

    if (!response.ok) {
      let errorMsg = "Registration failed";

      try {
        const data = JSON.parse(text);
        errorMsg =
          data?.message ||
          data?.title ||
          (data?.errors && Object.values(data.errors)[0]?.[0]) ||
          errorMsg;
      } catch {
        errorMsg = text || errorMsg;
      }

      throw new Error(errorMsg);
    }

    return text ? JSON.parse(text) : {};
  };

  // =========================
  // AUTO LOGIN (CLEAN)
  // =========================
  const autoLogin = async (email, password) => {
    const response = await fetch("/api/Authentication/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    if (!data.token) {
      throw new Error("No token received");
    }

    const userData = {
      email: data.email || email,
      name:
        data.name ||
        `${formData.firstName} ${formData.lastName}`.trim(),
      status: data.status || null,
    };

    // ✅ SINGLE SOURCE OF TRUTH
    login(data.token, userData);
  };

  // =========================
  // STUDENT SUBMIT
  // =========================
  const handleStudentSubmit = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      await callRegisterApi();
      await autoLogin(formData.email, formData.password);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // OWNER SUBMIT
  // =========================
  const handleOwnerVerificationSubmit = async (files) => {
    setIsLoading(true);
    setApiError("");

    try {
      await callRegisterApi();
      await autoLogin(formData.email, formData.password);

      try {
        const fd = new FormData();
        if (files.idFront) fd.append("IdFront", files.idFront);
        if (files.idBack) fd.append("IdBack", files.idBack);
        if (files.selfie) fd.append("SelfieWithId", files.selfie);

        const token = localStorage.getItem("token");

        await fetch("/api/Owner/UploadVerificationDocuments", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });
      } catch {
        toast.error("Documents upload failed, you can retry later");
      }

      toast.success("Account created successfully!");
      next();
    } catch (error) {
      toast.error(error.message);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // GOOGLE PREFILL OWNER
  // =========================
  const handleGoogleOwnerPrefill = (prefillData) => {
    setRole("owner");
    setGooglePrefill(prefillData);

    updateData({
      firstName: prefillData.firstName || "",
      lastName: prefillData.lastName || "",
      email: prefillData.email || "",
    });

    setStep(3);
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      {step === 1 && (
        <RoleStep
          onSelect={(selectedRole) => {
            setRole(selectedRole);
            setGooglePrefill(null);
            next();
          }}
          onGoogleOwnerPrefill={handleGoogleOwnerPrefill}
        />
      )}

      {step === 2 && (
        <BasicInfoStep
          role={role}
          data={formData}
          updateData={updateData}
          next={
            role === "student"
              ? handleStudentSubmit
              : next
          }
          prev={prev}
          isLoading={isLoading}
          apiError={apiError}
        />
      )}

      {step === 3 && role === "owner" && (
        <OwnerVerificationStep
          onSubmit={handleOwnerVerificationSubmit}
          onBack={googlePrefill ? () => setStep(1) : prev}
          isLoading={isLoading}
          apiError={apiError}
        />
      )}

      {step === 4 && (
        <SuccessStep email={formData.email} />
      )}
    </>
  );
}