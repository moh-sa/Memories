import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const NotRequireAuth = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  return auth?.user ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default NotRequireAuth;
