import { Welcome, welcomeLoader } from "@/pages/welcome";
import { Open } from "@/pages/open";
import { createBrowserRouter } from "react-router";
import { App } from "@/pages/app";
import TestPage from "@/pages/test/TestPage";

export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: TestPage,
  // },
  {
    path: "/",
    Component: Welcome,
    loader: welcomeLoader,
  },
  {
    path: "/open",
    Component: Open,
  },
  {
    path: "/app",
    Component: App,
  },
]);
