import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default ProtectedAdminRoute;
