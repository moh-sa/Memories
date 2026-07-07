import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import authReducer from "store/auth/auth.slice";
import memoryReducer from "store/memory/memory.slice";
import memoriesReducer from "store/memories/memories.slice";
import commentsReducer from "store/comments/comments.slice";
import type { RootState } from "store/store";

export const rootReducer = {
  auth: authReducer,
  memory: memoryReducer,
  memories: memoriesReducer,
  comments: commentsReducer,
};

export type PreloadedState = Partial<RootState>;

export function makeStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: false,
  });
}

export type AppStore = ReturnType<typeof makeStore>;

interface RenderOptions {
  preloadedState?: PreloadedState;
  store?: AppStore;
  initialEntries?: string[];
  routePath?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {},
) {
  const {
    preloadedState,
    store = makeStore(preloadedState),
    initialEntries = ["/"],
    routePath,
  } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ColorSchemeProvider
        colorScheme="light"
        toggleColorScheme={() => {}}
      >
        <MantineProvider>
          <NotificationsProvider>
            <MemoryRouter initialEntries={initialEntries}>
              {routePath
                ? (
                    <Routes>
                      <Route path={routePath} element={children} />
                    </Routes>
                  )
                : (
                    children
                  )}
            </MemoryRouter>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
