// Packages
import { Outlet } from "react-router-dom";
// Hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// UI Components
import LoadingOverlay from "components/common/Loader/Overlay";
// Actions
import { verifyToken } from "store/auth/auth.thunk";
import type { AppDispatch, RootState } from "store/store";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    let cancelled = false;

    const verifyRefreshToken = async () => {
      try {
        await dispatch(verifyToken());
      }
      catch (error) {
        console.log(error);
      }
      finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void (async () => {
      if (!user) {
        await verifyRefreshToken();
      }
      else {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, user]);

  return <>{isLoading ? <LoadingOverlay /> : <Outlet />}</>;
};

export default PersistLogin;
