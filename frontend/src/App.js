import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Home from "./components/Home";
import "../src/assets/styles/main.scss";
import "../src/assets/styles/dashboard.scss";
import Settings from "./components/Settings";
import MemberList from "./components/MemberList";
import MemberDetails from "./components/MemberDetails";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const { authState, setAuthState } = useContext(AuthContext); // Access context here
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDetails = localStorage.getItem("user");

    if (token && userDetails && userDetails !== "undefined") {
      try {
        const parsedUser = JSON.parse(userDetails);
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
      {/* Route for undefined paths, redirects to /home */}
      <Route path="*" element={<Navigate to="/home" />} />

      {/* Home route, accessible by all users */}
      <Route path="/home" element={<Home />} />

      {/* accessible by all users (public page) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected route for, only accessible by authenticated users */}
      {/* ProtectedRoute checks if the user is authenticated before rendering the protected Components */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route
        path="/memberdetails"
        element={<ProtectedRoute element={<MemberDetails />} />}
      />
      <Route
        path="/memberlist"
        element={<ProtectedRoute element={<MemberList />} />}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute element={<Settings />} />}
      />
    </Routes>
  );
}

export default App;
