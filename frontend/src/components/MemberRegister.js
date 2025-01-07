import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // For navigating after registration

const MemberRegister = ({ pageTitle, referralId }) => {
  const { authState } = useContext(AuthContext);
  const [memberRole, setMemberRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    role: memberRole,
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // useNavigate hook for page redirection

  // Destructure the user role to avoid multiple calls to authState.user
  const { role } = authState?.user || {};

  // Set member role based on user role
  useEffect(() => {
    if (
      authState.user &&
      authState.user.role &&
      (authState.user.role.toLowerCase() === "secondary" ||
        authState.user.role.toLowerCase() === "direct referral")
    ) {
      setMemberRole("indirect referral");
    }
  }, [authState.user]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: memberRole,
    }));
  }, [memberRole]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted data", formData);

    // Check if a role is selected
    if (!formData.role) {
      setMessage("Please select a role.");
      return;
    }

    try {
      // Prepare form data for submission
      const submitData = { ...formData, referredBy: referralId || null };

      // Check if the user already exists
      const checkRes = await axios.post(
        "http://localhost:5001/api/auth/check-user",
        {
          email: formData.email,
          mobile: formData.mobile,
        }
      );

      if (checkRes.data.exists) {
        setMessage("User already exists with this email or mobile number.");
        return; // Stop further execution if the user already exists
      }

      // Proceed to register the user if no conflict
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        submitData
      );

      setMessage(res.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        role: memberRole, // Reset the role
      });

      // Redirect to dashboard after successful registration
      window.location.href = "/dashboard";
      //   navigate("/dashboard"); // Use navigate instead of window.location.href
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during registration."
      );
    }
  };

  // Render form fields conditionally based on role
  const isAdmin =
    role &&
    role.toLowerCase() !== "secondary" &&
    role.toLowerCase() !== "direct referral";

  return (
    <>
      {/* <h4 className=" text-center mb-2">
              {pageTitle || "Add New Member"}
            </h4> */}
      {message && <p className="text-center text-success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid gd-sys gap-2">
          <div className="mb-1">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-1">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <label htmlFor="mobile" className="form-label">
              Mobile
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Conditionally render Password and Role fields based on user role */}
          {isAdmin && (
            <>
              <div className="mb-1">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-1">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="direct referral">Direct referral</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
            </>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Add Member
        </button>
      </form>
    </>
  );
};

export default MemberRegister;
