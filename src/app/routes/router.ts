import { Home } from "@/pages/home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);
