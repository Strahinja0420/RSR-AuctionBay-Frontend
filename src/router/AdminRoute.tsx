import { type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

type AdminRouteProps = {
  children: ReactNode;
};

function AdminRoute({ children }: AdminRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/login" replace></Navigate>;
  }

  if (auth.user.role !== "admin") {
    return <Navigate to="/" replace></Navigate>;
  }

  return <>{children}</>;
}

export default AdminRoute;
