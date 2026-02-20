import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, requiredRole }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && decoded.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;