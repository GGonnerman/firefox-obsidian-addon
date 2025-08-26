import { useEffect, useState } from "react";

export default function Popup() {
	const [apiKey, setApiKey] = useState<string>("");

	useEffect(() => {
		setApiKey(localStorage.getItem("api-key") || "");
	}, []);

	function updateApiKey(key: string) {
		localStorage.setItem("api-key", key);
		setApiKey(key);
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
			<div className="flex flex-row gap-2">
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
