import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('rcs_admin_token');
  const userJson = localStorage.getItem('rcs_user');
  const user = userJson ? JSON.parse(userJson) : null;
  const location = useLocation();

  if (!token) {
    // Redirect to login but save the current location to return to after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user doesn't have the required role, redirect them to their respective portal
    return <Navigate to={user.role === 'STAFF' ? '/dashboard' : '/admin'} replace />;
  }

  return children;
};

export default ProtectedRoute;
