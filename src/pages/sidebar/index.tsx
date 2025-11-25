import "@assets/styles/tailwind.css";
import "@pages/sidebar/index.css";
import { createRoot } from "react-dom/client";
import App from "./App";

function init() {
	const rootContainer = document.querySelector("#__root");
	if (!rootContainer) throw new Error("Can't find Side root element");
	const root = createRoot(rootContainer);
	root.render(<App />);
}

init();
