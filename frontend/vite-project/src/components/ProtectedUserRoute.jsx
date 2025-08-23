import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedUserRoute;
