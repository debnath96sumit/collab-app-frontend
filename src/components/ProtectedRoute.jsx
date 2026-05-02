import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  // return isAuthenticated ? children : <Navigate to="/login" replace />;
  return isAuthenticated
    ? children
    : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

export default ProtectedRoute;

