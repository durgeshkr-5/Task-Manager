import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth); // from authSlice

  // If user not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected component
  return children;
};

export default PrivateRoute;
