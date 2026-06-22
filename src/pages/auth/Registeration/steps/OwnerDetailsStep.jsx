import "../../../../styles/auth.css";

export default function OwnerDetailsStep({
  data,
  updateData,
  next,
  prev,
  isLoading,
  apiError,
}) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="text-center">
        <h1 className="login-title">Property Details</h1>
        <p className="welcome-sub" style={{ marginBottom: "30px" }}>
          Tell us about your property
        </p>
      </div>

      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Property Type *</label>
          <input
            className="auth-input"
            name="propertyType"
            placeholder="Property Type"
            value={data.propertyType}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            className="auth-input"
            name="location"
            placeholder="Location"
            value={data.location}
            onChange={handleChange}
          />
        </div>

        {apiError && <p className="error-text" style={{ textAlign: "center" }}>{apiError}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button 
            type="button" 
            className="auth-btn" 
            style={{ background: "#6c757d", flex: 1 }} 
            onClick={prev}
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="button"
            className="auth-btn"
            style={{ flex: 2 }}
            onClick={next}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}