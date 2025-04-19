import "@/Styles/index.less";
import { router } from "@/Data/Router";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import ContextProvider from "@/Components/ContextProvider";

createRoot(document.getElementById("root")!).render(
	<ContextProvider>
		<RouterProvider router={ router } />
	</ContextProvider>
);
