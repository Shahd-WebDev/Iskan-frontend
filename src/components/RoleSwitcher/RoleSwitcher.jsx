import React from "react";
import { useSignIn } from "../../context/SignInContext";
import "./RoleSwitcher.css";

const RoleSwitcher = () => {
  const { role, switchRole } = useSignIn();

  return (
    <div className="role-switcher">
      <div className="role-switcher-title">Switch Role (Dev Mode)</div>
      <div className="role-switcher-buttons">
        <button
          className={`role-btn ${role === "student" ? "active" : ""}`}
          onClick={() => switchRole("student")}
        >
          🎓 Student
        </button>
        <button
          className={`role-btn ${role === "owner" ? "active" : ""}`}
          onClick={() => switchRole("owner")}
        >
          🏠 Owner
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
