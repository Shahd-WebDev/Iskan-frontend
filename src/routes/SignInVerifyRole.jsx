import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSignIn } from '../context/SignInContext';

const SignInVerifyRole = ({ allowedRole, redirectTo = "/" }) => {
  const { role } = useSignIn();

  if (role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default SignInVerifyRole;
