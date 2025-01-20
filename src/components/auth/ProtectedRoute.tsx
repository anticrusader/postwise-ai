import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, session } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || !user) {
    console.log('No session or user found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};