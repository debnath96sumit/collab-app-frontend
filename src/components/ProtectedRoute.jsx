import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/" replace />;
  }

  return children; // If token exists, render the page
}
