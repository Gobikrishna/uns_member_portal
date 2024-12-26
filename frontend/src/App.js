import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthContext } from "./context/AuthContext";
import Register from "./components/Register";
import Home from "./components/Home";
import "../src/assets/styles/main.scss";
import "../src/assets/styles/dashboard.scss";

function App() {
  const { authState, setAuthState } = useContext(AuthContext); // Access context here
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user && user !== "undefined") {
      try {
        const parsedUser = JSON.parse(user);
        setAuthState({ isAuthenticated: true, user: parsedUser });
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthState({ isAuthenticated: false, user: null });
      }
    } else {
      setAuthState({ isAuthenticated: false, user: null });
    }
    setLoading(false); // Set loading to false after auth check
  }, [setAuthState]);

  if (loading) {
    // Show a loading spinner or screen until authState is initialized
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          authState.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
