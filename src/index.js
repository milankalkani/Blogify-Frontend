import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#5D866C",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#C0392B",
              color: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();
