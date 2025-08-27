import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import Note from "./Note";
import Vault from "./Vault";

export default function Sidebar() {
	const queryClient = new QueryClient();
	const [apiKey, setApiKey] = useState<string>("");
	const [path, setPath] = useState<string>("");
	const [currentTab, setCurrentTab] = useState<string>("");

	useEffect(() => {
		setApiKey(localStorage.getItem("api-key") || "");
	}, []);

	const handleSetPath = (path: string) => {
		setPath(path);
	};

	const updateActiveTab = () => {
		Browser.tabs
			.query({ currentWindow: true, active: true })
			.then((tabs) => setCurrentTab(tabs[0]?.url || ""));
	};

	useEffect(updateActiveTab, []);

	Browser.tabs.onActivated.addListener(updateActiveTab);

	return (
		<QueryClientProvider client={queryClient}>
			<Vault apiKey={apiKey} setPath={handleSetPath} />
			<br />
			{path && <Note key={path} apiKey={apiKey} path={path} />}
		</QueryClientProvider>
	);
}
