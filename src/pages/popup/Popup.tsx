import { useEffect, useState } from "react";
import {
	LOCAL_STORAGE_API_KEY,
	LOCAL_STORAGE_OBSIDIAN_URL,
} from "../constants";

export default function Popup() {
	const [apiKey, setApiKey] = useState<string>("");
	const [obsidianURL, setObsidianURL] = useState<string>("");

	useEffect(() => {
		setApiKey(localStorage.getItem(LOCAL_STORAGE_API_KEY) || "");
	}, []);

	function updateApiKey(key: string) {
		localStorage.setItem(LOCAL_STORAGE_API_KEY, key);
		setApiKey(key);
	}

	useEffect(() => {
		const defaultURL = "http://127.0.0.1:27123";
		let currentURL = localStorage.getItem(LOCAL_STORAGE_OBSIDIAN_URL);
		if (!currentURL) {
			localStorage.setItem(LOCAL_STORAGE_OBSIDIAN_URL, defaultURL);
			currentURL = defaultURL;
		}
		setObsidianURL(currentURL);
	}, []);

	function updateObsidianURL(url: string) {
		localStorage.setItem(LOCAL_STORAGE_OBSIDIAN_URL, url);
		setObsidianURL(url);
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
			<div className="flex flex-col gap-2">
				<label htmlFor="obsidian-url" className="text-white">
					Obsidian URL:
				</label>
				<input
					id="obsidian-url"
					placeholder="<enter obsidian url>"
					className="text-gray-300"
					value={obsidianURL}
					onChange={(e) => updateObsidianURL(e.target.value)}
				/>
				<label htmlFor="api-key" className="text-white">
					Api Key:
				</label>
				<input
					id="api-key"
					placeholder="<enter api key>"
					className="text-gray-300"
					value={apiKey}
					onChange={(e) => updateApiKey(e.target.value)}
				/>
			</div>
		</div>
	);
}
