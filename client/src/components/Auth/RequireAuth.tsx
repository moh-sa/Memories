import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import type { RootState } from "store/store";

const RequireAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
