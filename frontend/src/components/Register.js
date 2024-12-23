import { useState } from "react";
import axios from "axios";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    role: "primary",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if user exists
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
        formData
      );

      setMessage(res.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        role: "primary",
      });

      // Optionally redirect to login
      // window.location.href = "/login";
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during registration."
      );
    }
  };

  return (
    <div className="bg-image d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4 boxbg" style={{ width: "500px" }}>
      <div className="bg-overlay"></div>
      <div className="cont-int text-white">
      <div className="text-center mb-2">
        <Link className="navbar-brand  text-center" to="/home">
          <img width="100" src={logo} alt="Logo" />
        </Link>
      </div>
        <h5 className="card-title text-center mb-2 text-uppercase">Register your account</h5>
        {message && <p className="text-center text-danger">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label htmlFor="mobile" className="form-label">
              Mobile
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
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
          
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="text-center mt-3">
        If you have an account?{" "}
            <Link to="/login" className="text-decoration-none">
            SIGNIN
            </Link>
          </p>
      </div>
      </div>
    </div>
  );
};

export default Register;
