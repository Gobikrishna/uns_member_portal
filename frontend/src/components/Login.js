// //Login Component
// import { useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const Login = () => {
//   const { setAuthState } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log(email + password);
//     try {
//       const res = await axios.post("http://localhost:5001/api/auth/login", {
//         email,
//         password,
//       });

//       console.log("loging result==>" + res.data);
//       localStorage.setItem("token", res.data.token);
//       setAuthState({ isAuthenticated: true, user: res.data });
//     } catch (error) {
//       console.error("Login error", error);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;

import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { setAuthState } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      setAuthState({ isAuthenticated: true, user: res.data.user });

      // Optionally, redirect to the dashboard after successful login
      window.location.href = "/dashboard"; // Or use useNavigate() from react-router v6
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <h1 className="card-title text-center mb-4">Login</h1>
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
    </>
  );
};

export default Login;
