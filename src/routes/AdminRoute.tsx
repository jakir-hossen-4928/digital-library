import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("AdminRoute - User:", user, "Loading:", loading);

  if (loading) {
    console.log("AdminRoute - Still loading, showing loading indicator");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg bg-white shadow-md flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-indigo-600 border-b-indigo-300 border-l-indigo-300 border-r-indigo-300 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminRoute - No user, redirecting to /admin-login");
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  console.log("AdminRoute - User authenticated, rendering children");
  return <>{children}</>;
};

export default AdminRoute;