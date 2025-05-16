import { Welcome, welcomeLoader } from "@/pages/welcome";
import { Open } from "@/pages/open";
import { createBrowserRouter } from "react-router";
import { App } from "@/pages/app";
import { New, AssetEdit, InstitutionSheet } from "@/pages/new";
import { journalLoader } from "../loaders/journalLoader";
import { assetStateLoader } from "@/pages/new/lib/assetStateLoader";
import { InstitutionEdit } from "@/pages/new/ui/institution-edit/InstitutionEdit";
// import { createRecordDraft } from "@/features/create-record";

export const router = createBrowserRouter([
  {
    path: "newrecord",
    Component: New,
    loader: journalLoader,
    children: [
      {
        path: "institutions/:institutionId",
        Component: InstitutionSheet,
      },
    ],
  },

  {
    path: "newrecord/institutions/:institutionId/assets/create",
    Component: AssetEdit,
    loader: assetStateLoader,
  },

  {
    path: "newrecord/institutions/:institutionId/assets/:assetId/edit",
    Component: AssetEdit,
    loader: assetStateLoader,
  },

  {
    path: "newrecord/institutions/create",
    Component: InstitutionEdit,
    loader: assetStateLoader,
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
    loader: journalLoader,
  },
]);

/* ---------- Comment ---------- 

React Router Data mode was choosen for extra features like loaders.
But later I replaced initial loaders with traditional approach (loading when component opens)
Mostly because an app must constantly check if Journal still in-memory and redirect user if not

*/
