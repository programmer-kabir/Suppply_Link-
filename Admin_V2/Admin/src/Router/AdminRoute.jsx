import { Navigate } from "react-router-dom";
import { useAuth } from "../Provider/AuthProvider";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/sign_in" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/sign_in" replace />;
  }

  // ✅ Admin হলে
  return children;
};

export default AdminRoute;
