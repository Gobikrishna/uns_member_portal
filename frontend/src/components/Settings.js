import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Clear error and submit the form
    setError("");
    console.log("Form Submitted:", formData);

    // Call API to update password here
    alert("Password updated successfully!");
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="bg-image d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow p-4 boxbg" style={{ width: "400px" }}>
          <div className="bg-overlay"></div>
          <div className="cont-int text-white">
          <div className="text-center mb-2">
              <Link className="navbar-brand" to="/home">
                <img width="100" src={logo} alt="Logo" />
              </Link>
            </div>
            <h5 className="card-title text-center mb-2 text-uppercase">
              Change your password
            </h5>
      <form onSubmit={handleSubmit} >
        {/* Old Password */}
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">
            Old Password
          </label>
          <input
            type="password"
            className="form-control"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </div>
      </form>
      </div>
    </div>
    </div>
  );
};

export default Settings;
