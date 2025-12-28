import { Navigate } from "react-router-dom";
import React from 'react';
import { useAuth } from '../contexts/AuthContext';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
