import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { KonstaUIProvider } from "../providers/KonstaUIProvider";
import { TinyBaseProvider } from "../providers/TinyBaseProvider";
import { router } from "./router";

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
	</React.StrictMode>,
);
