import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MantineProviders from "components/MantineProviders";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "./App";
import { ScrollToTop } from "components";
import store from "store/store";

if (import.meta.env.PROD) {
  disableReactDevTools();
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element \"#root\" was not found in the document.");
}
const root = ReactDOM.createRoot(container);
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
  </React.StrictMode>,
);
