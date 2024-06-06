import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
