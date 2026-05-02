import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import Loading from "../Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated
    ? children
    : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

export default ProtectedRoute;

