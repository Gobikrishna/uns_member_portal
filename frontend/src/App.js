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
import MemberDashboard from "./components/admin/MemberDashboard";
import MemberData from "./components/admin/MemberData";
import ReferralDetails from "./components/admin/ReferralDetails";

// AdminRoute Component
const AdminRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated || authState.user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

// UserRoute Component for non-admin roles
const UserRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated || authState.user.role === "admin") {
    return <Navigate to="/admin-dashboard" />;
  }

  return element;
};

// This component is for authenticated users only (both admin and non-admin)
const ProtectedRouteForUsers = ({ element }) => {
  const { authState } = useContext(AuthContext);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

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

      {/* Login and Register routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected route for Dashboard, only accessible by non-admin roles */}
      <Route
        path="/dashboard"
        element={<UserRoute element={<Dashboard />} />}
      />

      {/* Admin-only routes */}
      <Route
        path="/admin-dashboard"
        element={<AdminRoute element={<AdminDashboard />} />}
      />
      <Route
        path="/member-dashboard"
        element={<AdminRoute element={<MemberDashboard />} />}
      />

      <Route
        path="/member-data"
        element={<AdminRoute element={<MemberData />} />}
      />

      <Route
        path="/referral-details"
        element={<AdminRoute element={<ReferralDetails />} />}
      />

      {/* Member Details - Protected route for authenticated users */}
      {/* <Route
        path="/memberdetails"
        element={<UserRoute element={<MemberDetails />} />}
      /> */}

      {/* Member Details - Protected route for authenticated users (both admin and non-admin) */}
      <Route
        path="/memberdetails"
        element={<ProtectedRouteForUsers element={<MemberDetails />} />}
      />

      {/* Settings route - Protected route, accessible by all authenticated users */}
      <Route
        path="/settings"
        element={<ProtectedRoute element={<Settings />} />}
      />
    </Routes>
  );
}

export default App;
