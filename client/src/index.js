import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MantineProviders from "components/MantineProviders";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App";
import { ScrollToTop } from "components";
import store from "store/store";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <MantineProviders>
          <ScrollToTop />
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </MantineProviders>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
