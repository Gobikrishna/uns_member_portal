// Global Auth Context
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    userId: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    let id = null;

    // Retrieve the value of 'user' from localStorage
    const userString = localStorage.getItem("user");

    // Check if the value exists and parse it as an object
    if (token && userString) {
      const userObject = JSON.parse(userString); // Convert JSON string to object
      id = userObject.id; // Access the id property
      console.log("User ID:", id);
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      setAuthState({
        isAuthenticated: true,
        user: { token },
        userId: id,
      });
    } else {
      console.log("User not found in localStorage.");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
