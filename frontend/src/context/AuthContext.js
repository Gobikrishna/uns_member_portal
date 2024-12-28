import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
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
    const userDetails = localStorage.getItem("user");

    // If there's no token or user, or if the token is expired, clear auth state
    if (!token || !userDetails || isTokenExpired(token)) {
      console.log("No token or token expired.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
      });

      // Only navigate to login if we're not already on public routes
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        // Delay navigation to prevent the warning
        setTimeout(() => {
          navigate("/login");
        }, 0);
      }
    } else {
      console.log("Token still valid.");
      const userObject = JSON.parse(userDetails); // Convert JSON string to object
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      setAuthState({
        isAuthenticated: true,
        token: token,
        user: userObject,
      });
    }
  }, [navigate]); // Dependency array includes `navigate` for redirection

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
