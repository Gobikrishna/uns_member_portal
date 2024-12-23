// // import React, { useContext, useEffect } from "react";
// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import Login from "./components/Auth/Login";
// // import Dashboard from "./components/Dashboard/Dashboard";
// // import { AuthContext, AuthProvider } from "./context/AuthContext";
// // import { Navigate } from "react-router-dom";

// // function App() {
// //   const { authState, setAuthState } = useContext(AuthContext); // Access context here

// //   useEffect(() => {
// //     // Check for the token in localStorage and update auth state
// //     const token = localStorage.getItem("token");
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     if (token && user) {
// //       setAuthState({ isAuthenticated: true, user });
// //     }
// //   }, [setAuthState]);
// //   return (
// //     <AuthProvider>
// //       <Login />
// //       <Router>
// //         <Routes>
// //           <Route exact path="/login" component={Login} />
// //           <Route
// //             path="/dashboard"
// //             element={
// //               authState.isAuthenticated ? (
// //                 <Dashboard />
// //               ) : (
// //                 <Navigate to="/login" />
// //               )
// //             }
// //           />
// //           <Route path="*" element={<Navigate to="/login" />} />
// //         </Routes>
// //       </Router>
// //     </AuthProvider>
// //   );
// // }

// // export default App;

// import React, { useEffect, useContext } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext"; // Import AuthContext
// import Login from "./components/Auth/Login";
// import Dashboard from "./components/Dashboard/Dashboard";

// function App() {
//   const { authState, setAuthState } = useContext(AuthContext); // Access context here

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   const user = JSON.parse(localStorage.getItem("user"));
//   //   if (token && user) {
//   //     setAuthState({ isAuthenticated: true, user });
//   //   }
//   // }, [setAuthState]);
//   // useEffect to check localStorage on initial load and set auth state
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     // Check if 'user' exists and is not the string "undefined"
//     if (token && user && user !== "undefined") {
//       try {
//         const parsedUser = JSON.parse(user); // Parse user data if valid
//         setAuthState({ isAuthenticated: true, user: parsedUser });
//       } catch (err) {
//         console.error("Error parsing user data", err);
//         // Optionally clear localStorage if parsing fails
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//       }
//     }
//   }, [setAuthState]);
//   console.log("Main page==>", authState.isAuthenticated);
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/dashboard"
//         element={
//           authState.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
//         }
//       />
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;

import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthContext } from "./context/AuthContext";
import Register from "./components/Register";
import Home from "./components/Home";
import "../src/assets/styles/main.scss";
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
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          authState.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
