import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, useLocation } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { loggedIn } = useSelector((state: RootState) => state.loginReducer);
  const location = useLocation();

  // If route doesn't require auth (like welcome page), allow access
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is not logged in, redirect to welcome page
  if (!loggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If user is logged in, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
