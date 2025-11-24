import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import Browser, { type Tabs } from "webextension-polyfill";

export default function TabFollower({
	apiKey,
	obsidianURL,
	updatePath,
}: {
	apiKey: string;
	obsidianURL: string;
	updatePath: (path: string[]) => void;
}) {
	const [currentTab, _setCurrentTab] = useState<string>("");
	const [isFollowing, setIsFollowing] = useState(true);

	const setCurrentTab = useCallback((url: string) => {
		// These pages should be used interchangable to better match users
		// expected behavior.
		if (url === "about:blank") {
			url = "about:newtab";
		}
		_setCurrentTab(url);
	}, []);

	// Indicates the current tab url was updated/changed
	const changeCurrentURL = useCallback(
		(
			_tabId: number,
			_changeInfo: Tabs.OnUpdatedChangeInfoType,
			tab: Tabs.Tab,
		) => {
			//const status = changeInfo.status;
			//if (!status || status !== "complete") return;
			if (!tab.active) return;
			const currentUrl = tab.url;
			if (!currentUrl) return;
			if (currentUrl === currentTab) return;

			setCurrentTab(currentUrl);
		},
		[currentTab, setCurrentTab],
	);

	// Indicates going to a new/different tab
	const updateActiveTab = useCallback(() => {
		Browser.tabs
			.query({ currentWindow: true, active: true })
			.then((tabs) => setCurrentTab(tabs[0].url || ""));
	}, [setCurrentTab]);

	useEffect(() => {
		Browser.tabs.onActivated.addListener(updateActiveTab);
		Browser.tabs.onUpdated.addListener(changeCurrentURL);
		return () => {
			Browser.tabs.onActivated.removeListener(updateActiveTab);
			Browser.tabs.onUpdated.removeListener(changeCurrentURL);
		};
	}, [changeCurrentURL, updateActiveTab]);
	//Browser.tabs.onActivated.addListener(updateActiveTab);
	//Browser.tabs.onUpdated.addListener(changeCurrentURL);

	const fetchCurrentTabNote = async () => {
		console.log(`Fetching current tab node for ${currentTab}`);
		if (!apiKey || apiKey === "") {
			throw new Error("Missing API Key for follower");
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
		const json = await response.json();
		console.log(`Received the response of`, json);
		return json;
	};

	const {
		isLoading: isPending,
		isError,
		data,
		error,
	} = useQuery({
		queryKey: [currentTab],
		queryFn: fetchCurrentTabNote,
	});

	useEffect(() => {
		if (!data || data.length < 1 || !isFollowing) return;
		updatePath(data[0].filename.split(/(?<=\/)/));
		console.log(`Path is now, ${data[0].filename}`);
	}, [data, updatePath, isFollowing]);

	if (isPending) {
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
			<div className="switch-container">
				<label className="switch">
					Follow Tabs
					<input
						type="checkbox"
						value="boolean"
						checked={isFollowing}
						onClick={() => setIsFollowing((c) => !c)}
					/>
					<span></span>
				</label>
			</div>
		</div>
	);
}
