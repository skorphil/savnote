import { Welcome, welcomeLoader } from "@/pages/welcome";
import { Open } from "@/pages/open";
import { createBrowserRouter } from "react-router";
import { App } from "@/pages/app";
import { New, AssetEdit, InstitutionSheet } from "@/pages/new";
// import { createRecordDraft } from "@/features/create-record";

export const router = createBrowserRouter([
  {
    path: "newrecord",
    Component: New,
    // loader: createRecordDraft,
    children: [
      {
        path: "institutions/:institutionId",
        Component: InstitutionSheet,
      },
    ],
  },

  {
    path: "newrecord/institutions/:institutionId/assets/:assetId/edit",
    Component: AssetEdit,
  },

  {
    path: "/",
    Component: Welcome,
    loader: welcomeLoader,
  },
  {
    path: "open",
    Component: Open,
  },
  {
    path: "app",
    Component: App,
  },
]);
