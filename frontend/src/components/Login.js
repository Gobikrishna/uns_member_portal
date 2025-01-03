import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Login = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDetails = localStorage.getItem("user");

    // If the token and user exist, redirect to the dashboard
    if (token && userDetails) {
      // Token exists, so the user is already logged in
      navigate("/dashboard"); // Redirect to the dashboard or other authenticated page
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email + password);

    try {
      // Send the login request to the backend
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      console.log("login result==>", res.data);

      // Store token and user data in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data as JSON string

      // Update context state with the user and authentication status
      setAuthState({
        isAuthenticated: true,
        token: res.data.token,
        user: res.data.user,
      });
      // Navigate to the dashboard after successful login
      authState.user && authState.user.role.toLowerCase() !== "admin"
        ? navigate("/dashboard")
        : navigate("/admin-dashboard");
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <>
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
              Sign In to Your Account
            </h5>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
