import { useEffect, useState } from "react";
import Navigator from "./Navigator";
import Note from "./Note";
import TabFollower from "./TabFollower";

export default function Sidebar() {
	const obsidianURL = "http://127.0.0.1:27123";

	const [apiKey, setApiKey] = useState<string>("");
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

	const handleUpdateRawPath = (pathParts: string[]) => {
		setPathParts(pathParts);
	};

	const popPath = () => {
		if (rawPath.length === 0) return;
		setPathParts((curr) => [...curr.slice(0, -1)]);
	};

	return (
		<>
			<TabFollower
				apiKey={apiKey}
				obsidianURL={obsidianURL}
				updatePath={handleUpdateRawPath}
			/>
			<div className="w-full h-full">
				<Navigator
					obsidianURL={obsidianURL}
					apiKey={apiKey}
					path={path}
					pushPath={pushPath}
					popPath={popPath}
				/>
				{path.includes(".") && (
					<Note
						key={path}
						obsidianURL={obsidianURL}
						apiKey={apiKey}
						path={path}
					/>
				)}
			</div>
		</>
	);
}
