import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Components/Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
