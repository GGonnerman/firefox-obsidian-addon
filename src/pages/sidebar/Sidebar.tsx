import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import Note from "./Note";
import Vault from "./Vault";

export default function Sidebar() {
	const obsidianURL = "http://127.0.0.1:27123";

	const queryClient = new QueryClient();
	const [apiKey, setApiKey] = useState<string>("");
	const [currentTab, setCurrentTab] = useState<string>("");
	const [rawPath, setPathParts] = useState<string[]>([]);
	const [path, setPath] = useState("");

	useEffect(() => {
		setApiKey(localStorage.getItem("api-key") || "");
	}, []);

	const pushPath = (newPart: string) => {
		setPathParts((curr) => [...curr, newPart]);
	};

	useEffect(() => {
		setPath(rawPath.join(""));
	}, [rawPath]);

	const popPath = () => {
		if (rawPath.length === 0) return;
		setPathParts((curr) => [...curr.slice(0, -1)]);
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
			{rawPath.length > 0 && (
				<p onMouseDown={popPath} className="cursor-pointer">
					...
				</p>
			)}
			{!path.includes(".") && (
				<Vault
					obsidianURL={obsidianURL}
					apiKey={apiKey}
					key={path}
					path={path}
					pushPath={pushPath}
					popPath={popPath}
				/>
			)}
			<br />
			{path.includes(".") && (
				<Note
					key={path}
					obsidianURL={obsidianURL}
					apiKey={apiKey}
					path={path}
				/>
			)}
		</QueryClientProvider>
	);
}
