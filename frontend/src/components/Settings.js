import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { authState, setAuthState } = useContext(AuthContext); // Access auth context
  const navigate = useNavigate(); // Navigate to login after logout

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      setSuccessMessage("");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setSuccessMessage("");
      return;
    }

    // Clear previous messages
    setError("");

    try {
      const userId = authState.user.id;
      // const userId = JSON.parse(localStorage.getItem("user")).id; // Assuming user ID is stored in localStorage
      await axios.put(
        `http://localhost:5001/api/auth/change-password/${userId}`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      setSuccessMessage("Password updated successfully!");

      // Perform logout after a short delay
      setTimeout(() => {
        // Clear the authState in context
        setAuthState({ isAuthenticated: false, token: null, user: null });

        // Clear the user token and details from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect the user to the login page
        navigate("/login");
      }, 2000); // 2-second delay for the success message
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while updating the password."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <Header />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-dgrey">
        <div className="card shadow p-4 boxbg" style={{ width: "400px" }}>
          <div className="bg-overlay"></div>
          <div className="cont-int text-white">
            {/* <div className="text-center mb-2">
            <Link className="navbar-brand" to="/home">
              <img width="100" src={logo} alt="Logo" />
            </Link>
          </div> */}
            <h5 className="card-title text-center mb-2 text-uppercase">
              Change your password
            </h5>
            <form onSubmit={handleSubmit}>
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
                  aria-describedby="oldPasswordHelp"
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

              {/* Success Message */}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

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
      <Footer />
    </div>
  );
};

export default Settings;
