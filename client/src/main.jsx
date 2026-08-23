import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import "./App.css";

import App from "./App.jsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </HelmetProvider>
    </StrictMode>
);