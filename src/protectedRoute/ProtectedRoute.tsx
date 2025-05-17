import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const userInfoStr = localStorage.getItem("userInfo");
  const user = userInfoStr ? JSON.parse(userInfoStr) : null;

  if (!user) {
    return <Navigate to="/login" />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
