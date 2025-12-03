import {
	LOCAL_STORAGE_API_KEY,
	LOCAL_STORAGE_OBSIDIAN_URL,
} from "@src/pages/constants";
import { createContext, type ReactNode, useEffect, useState } from "react";

type Config = {
	obsidianURL: string;
	apiKey: string;
	setObsidianURL: (newObsidianURL: string) => void;
	setApiKey: (newApiKey: string) => void;
};

export const ConfigContext = createContext<Config>({
	obsidianURL: "",
	apiKey: "",
	setObsidianURL: (_: string) => {},
	setApiKey: (_: string) => {},
});

export function ConfigContextProvider({ children }: { children: ReactNode }) {
	const [obsidianURL, setObsidialURL] = useState("");
	const [apiKey, setApiKey] = useState("");

	useEffect(() => {
		setObsidialURL(localStorage.getItem(LOCAL_STORAGE_OBSIDIAN_URL) || "");
	}, []);

	useEffect(() => {
		setApiKey(localStorage.getItem(LOCAL_STORAGE_API_KEY) || "");
	}, []);

	const handleSetObsidianURL = (newObsidianURL: string) => {
		while (newObsidianURL.endsWith("/")) {
			newObsidianURL = newObsidianURL.slice(0, -1);
		}
		localStorage.setItem(LOCAL_STORAGE_OBSIDIAN_URL, newObsidianURL);
		setObsidialURL(newObsidianURL);
	};

	const handleSetApiKey = (newApiKey: string) => {
		localStorage.setItem(LOCAL_STORAGE_API_KEY, newApiKey);
		setApiKey(newApiKey);
	};

	return (
		<ConfigContext.Provider
			value={{
				obsidianURL,
				apiKey,
				setObsidianURL: handleSetObsidianURL,
				setApiKey: handleSetApiKey,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
}
