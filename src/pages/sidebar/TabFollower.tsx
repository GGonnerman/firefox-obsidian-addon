import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import { searchVault } from "./api/vault";

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

	// Searches for a note with specific header information
	const query = { regexp: [currentTab, { var: "frontmatter.url" }] };
	const { isPending, isError, data, error } = useQuery({
		queryKey: [currentTab, apiKey, obsidianURL, query],
		queryFn: () => searchVault({ apiKey, obsidianURL, query }),
	});

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return (
			<div>
				<p>Error in Tab Follower: {error.message}</p>
			</div>
		);
	}

	// The split(/(?<=\/)/) will split after slashes and leave them intact!
	return (
		<div>
			<span className="text-gray-500 text-xs">{currentTab}</span>
			<div>
				{data.length > 0 && (
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
