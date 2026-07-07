import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "layouts/Main/Main";
// Public Components
import { Home, Missing, Auth } from "pages";
// Protected Components
import User from "pages/user";
import Search from "pages/search";
import MemoryDetails from "pages/Memory/Details/Details";
// Controll Access
import RequireAuth from "components/Auth/RequireAuth";
import { PersistLogin, NotRequireAuth } from "components/Auth";
import LoadingOverlay from "components/common/Loader/Overlay";

const MemoryCreate = lazy(() => import("pages/Memory/Create/Create"));
const MemoryEdit = lazy(() => import("pages/Memory/Edit/Edit"));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route element={<PersistLogin />}>
          {/* public routes */}
          {/* home route */}
          <Route index element={<Home />} />

          {/* user routes */}
          <Route path="user">
            <Route index element={<Navigate to="/" />} />
            <Route path=":username" element={<User.Profile />} />
            <Route path=":username/memories" element={<User.Memories />} />
            <Route path=":username/likes" element={<User.Memories />} />
          </Route>

          {/* memory routes */}
          <Route path="memory">
            <Route index element={<Navigate to="/" />} />
            <Route path=":_id" element={<MemoryDetails />} />
          </Route>

          {/* search routes */}
          <Route path="search">
            <Route index element={<Search.Search />} />
          </Route>

          {/* protected routes */}
          {/* memory routes */}
          <Route path="memory">
            <Route element={<RequireAuth />}>
              <Route
                path="create"
                element={(
                  <Suspense fallback={<LoadingOverlay />}>
                    <MemoryCreate />
                  </Suspense>
                )}
              />
              <Route
                path="edit"
                element={(
                  <Suspense fallback={<LoadingOverlay />}>
                    <MemoryEdit />
                  </Suspense>
                )}
              />
            </Route>
          </Route>

          {/* Prevent LoggenIn users from accessing */}
          <Route element={<NotRequireAuth />}>
            <Route path="login" element={<Auth.Login />} />
            <Route path="register" element={<Auth.Register />} />
            <Route path="activation" element={<Auth.Activation />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
