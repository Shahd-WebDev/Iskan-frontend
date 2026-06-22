import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignInVerifyRole = ({ allowedRole, redirectTo = "/" }) => {
  const { user } = useAuth();
  
  // Note: JWT roles might be 'Admin', 'Owner', 'Student'. Adjust case if necessary
  if (!user || user.role?.toLowerCase() !== allowedRole?.toLowerCase()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default SignInVerifyRole;
