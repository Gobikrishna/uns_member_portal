import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { authState } = useContext(AuthContext);
  return authState.isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
