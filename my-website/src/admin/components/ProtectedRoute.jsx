import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('rcs_admin_token');
  const location = useLocation();

  if (!token) {
    // Redirect to login but save the current location to return to after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
