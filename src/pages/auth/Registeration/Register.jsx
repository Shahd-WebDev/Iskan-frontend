import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";
import { register as registerApi } from "../../../services/auth";
import { getRegisterErrorMessage } from "../../../utils/authErrorMessages";

import RoleStep from "./steps/RoleStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import OwnerVerificationStep from "./steps/OwnerVerificationStep";
import SuccessStep from "./steps/SuccessStep";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);

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

  const updateData = (data) => setFormData((prev) => ({ ...prev, ...data }));

  // =========================
  // BUILD FORM DATA
  // =========================
  const buildFormData = (files = null) => {
    const fd = new FormData();

    fd.append("Role", role === "owner" ? "Owner" : "Student");
    fd.append("FirstName", formData.firstName);
    fd.append("LastName", formData.lastName);
    fd.append("Email", formData.email);
    fd.append("Password", formData.password);

    if (formData.dateOfBirth) {
      fd.append("DateOfBirth", formData.dateOfBirth);
    }

    if (formData.gender) {
      fd.append(
        "Gender",
        formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
      );
    }

    // Owner files
    if (files?.idFront) {
      fd.append("NationalIdImage", files.idFront);
    }

    if (files?.idBack) {
      fd.append("NationalIdBackImage", files.idBack);
    }

    if (files?.selfie) {
      fd.append("SelfieImage", files.selfie);
    }

    return fd;
  };

  // =========================
  // STUDENT SUBMIT
  // =========================
  const handleStudentSubmit = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const fd = buildFormData();

      if (import.meta.env.DEV) {
        console.debug("Student Register FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
      }

      await registerApi(fd);

      toast.success("Account created successfully! Please verify your email.");

      setStep(4);
    } catch (error) {
      const errMsg = error.message;
      toast.error(errMsg);
      setApiError(errMsg);
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
      if (!files.selfie) throw new Error("Selfie image is required");

      if (!files.idFront)
        throw new Error("National ID Front image is required");

      const fd = buildFormData(files);

      if (import.meta.env.DEV) {
        console.debug("Owner Register FormData:");
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }
      }

      // Registration ONLY — no authenticated API calls here.
      // SubmitVerification is deferred to after login via /identity-verification.
      await registerApi(fd);

      toast.success(
        "Registration completed successfully! Please verify your email.",
      );

      next();
    } catch (error) {
      const errMsg = getRegisterErrorMessage(error);
      toast.error(errMsg);
      setApiError(errMsg);
    } finally {
      setIsLoading(false);
    }
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
            next();
          }}
        />
      )}

      {step === 2 && (
        <BasicInfoStep
          role={role}
          data={formData}
          updateData={updateData}
          next={role === "student" ? handleStudentSubmit : next}
          prev={prev}
          isLoading={isLoading}
          apiError={apiError}
        />
      )}

      {step === 3 && role === "owner" && (
        <OwnerVerificationStep
          onSubmit={handleOwnerVerificationSubmit}
          onBack={prev}
          isLoading={isLoading}
          apiError={apiError}
        />
      )}

      {step === 4 && <SuccessStep email={formData.email} role={role} />}
    </>
  );
}
