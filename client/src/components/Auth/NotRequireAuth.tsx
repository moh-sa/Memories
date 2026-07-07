import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import type { RootState } from "store/store";

const NotRequireAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return auth.user
    ? (
        <Navigate to="/" state={{ from: location }} replace />
      )
    : (
        <Outlet />
      );
};

export default NotRequireAuth;
