// Global Auth Context
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    userId: null,
    userRole: null,
  });
  const navigate = useNavigate();

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime; // Return true if expired
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // If decoding fails, treat as expired
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    console.log("Token from localStorage:", token);
    console.log("User from localStorage:", userString);

    if (token && userString) {
      if (isTokenExpired(token)) {
        // Token expired: clear localStorage, reset authState, and redirect to login
        console.log("Token expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({
          isAuthenticated: false,
          user: null,
          userId: null,
          userRole: null,
        });
        navigate("/login"); // Redirect to login page
      } else {
        // Token is valid: extract user info and set authState
        console.log("Token still valid.");
        const userObject = JSON.parse(userString); // Convert JSON string to object
        console.log("userObject==>", userObject);
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
        setAuthState({
          isAuthenticated: true,
          user: { token },
          userId: userObject.id,
          userRole: userObject.role,
        });
      }
    } else {
      // Token or user data missing: reset authState and navigate to login
      console.log("Token or user data not found in localStorage.");
      setAuthState({
        isAuthenticated: false,
        user: null,
        userId: null,
        userRole: null,
      });
      navigate("/login"); // Redirect to login page
    }
  }, []); // Dependency array includes `navigate` for redirection

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
