import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";

export default function TabFollower({
	apiKey,
	obsidianURL,
	updatePath,
}: {
	apiKey: string;
	obsidianURL: string;
	updatePath: (path: string[]) => void;
}) {
	const [currentTab, setCurrentTab] = useState<string>("");
	const updateActiveTab = () => {
		Browser.tabs
			.query({ currentWindow: true, active: true })
			.then((tabs) => setCurrentTab(tabs[0]?.url || ""));
	};

	useEffect(updateActiveTab, []);

	Browser.tabs.onActivated.addListener(updateActiveTab);

	const fetchCurrentTabNote = async () => {
		console.log(`Fetching current tab node for ${currentTab}`);
		if (!apiKey || apiKey === "") {
			throw new Error("Missing API Key");
		}
		const baseURL = `${obsidianURL}/search/`;
		const bearer = `Bearer ${apiKey}`;
		const response = await fetch(baseURL, {
			headers: {
				"content-type": "application/vnd.olrapi.jsonlogic+json",
				Authorization: bearer,
			},
			method: "POST",
			body: JSON.stringify({
				regexp: [currentTab, { var: "frontmatter.url" }],
			}),
		});
		if (!response.ok) {
			throw new Error(
				`Network response was not ok: ${JSON.stringify(response)}`,
			);
		}
		return response.json();
	};

	const { isLoading, isError, data, error } = useQuery({
		queryKey: [currentTab],
		queryFn: fetchCurrentTabNote,
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return (
			<div>
				<span>Error in Vault Navigator</span>
				<p>Error: ${error.message}</p>
			</div>
		);
	}

	// The split(/(?<=\/)/) will split after slashes and leave them intact!
	return (
		<div>
			<span className="text-gray-500 text-xs">{currentTab}</span>
			<div>
				{data && data.length > 0 && (
					<button
						type="button"
						className="cursor-pointer bg-green-300 border-2 rounded-md p-2"
						onClick={() => updatePath(data[0].filename.split(/(?<=\/)/))}
					>
						Go to {data[0].filename}
					</button>
				)}
			</div>
		</div>
	);
}
