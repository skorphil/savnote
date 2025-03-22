import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { TinyBaseProvider } from "../providers/TinyBaseProvider";
import { KonstaUIProvider } from "../providers/KonstaUIProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <KonstaUIProvider>
      <TinyBaseProvider>
        <RouterProvider router={router} />
      </TinyBaseProvider>
    </KonstaUIProvider>
  </React.StrictMode>
);
