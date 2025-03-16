import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { App, KonstaProvider } from "konsta/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <KonstaProvider theme="material">
      <App theme="material" className="k-material">
        <RouterProvider router={router} />
      </App>
    </KonstaProvider>
  </React.StrictMode>
);
