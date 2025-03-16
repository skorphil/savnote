import { Welcome } from "@/pages/welcome";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
]);
