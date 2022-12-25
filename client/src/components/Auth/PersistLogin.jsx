//Packages
import { Outlet } from "react-router-dom";
//Hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//UI Components
import { Common } from "components";
//Actions
import { verifyToken } from "store/auth/auth.thunk";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await dispatch(verifyToken());
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.user ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {}, [isLoading]);

  return <>{isLoading ? <Common.LoadingOverlay /> : <Outlet />}</>;
};

export default PersistLogin;
