import { Navigate } from "react-router-dom";
import { type JSX } from "react";

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  if (!token  || token === "null" || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;