import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { TinyBaseProvider } from "../providers/TinyBaseProvider";
import { KonstaUIProvider } from "../providers/KonstaUIProvider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <KonstaUIProvider>
      <TinyBaseProvider>
        <RouterProvider router={router} />
      </TinyBaseProvider>
    </KonstaUIProvider>
  </React.StrictMode>
);
