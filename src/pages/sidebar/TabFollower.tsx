import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";
import Browser, { type Tabs } from "webextension-polyfill";
import { createNote } from "./api/note";
import { searchVault } from "./api/vault";
import { ConfigContext } from "./contexts/ConfigContextProvider";

export default function TabFollower({
	updatePath,
}: {
	updatePath: (path: string[]) => void;
}) {
	// TODO: Make "create new page" only show if there is "synced" note found
	//       Might actually be more difficult than I expect.
	// TODO: When using navigation, make that turn *off* follow tab
	// TODO: Add different matching schemas (base vs domain vs subdomain vs ...).
	//       Unsure on difficulty
	const { apiKey, obsidianURL } = useContext(ConfigContext);
	const [isFollowing, setIsFollowing] = useState<boolean>(true);
	const [currentTab, setCurrentTab] = useState<Tabs.Tab>();
	const [currentURL, _setCurrentURL] = useState<string>("");
	const setCurrentURL = useCallback((url: string) => {
		// These pages should be used interchangable to better match users
		// expected behavior.
		if (url === "about:blank") {
			url = "about:newtab";
		}
		_setCurrentURL(url);
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
			const newURL = tab.url;
			if (!newURL) return;
			setCurrentTab(tab);
			if (newURL === currentURL) return;
			console.log("Saw change in curent url", {
				tab: tab,
				oldURL: currentURL,
				newURL: newURL,
			});

			setCurrentURL(newURL);
		},
		[currentURL, setCurrentURL],
	);

	// Indicates going to a new/different tab
	const updateActiveTab = useCallback(() => {
		Browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
			setCurrentURL(tabs[0].url || "");
			setCurrentTab(tabs[0]);
		});
	}, [setCurrentURL]);

	useEffect(updateActiveTab, []);

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
	// Searches for a note with specific header information
	const query = { regexp: [currentURL, { var: "frontmatter.url" }] };
	const { isPending, isError, data, error } = useQuery({
		enabled: apiKey !== undefined,
		queryKey: [currentURL, apiKey, obsidianURL, query],
		queryFn: () => searchVault({ apiKey, obsidianURL, query }),
	});

	useEffect(() => {
		if (!data || data.length < 1 || !isFollowing) return;
		updatePath(data[0].filename.split(/(?<=\/)/));
		console.log(`Path is now, ${data[0].filename}`);
	}, [data, updatePath, isFollowing]);

	if (apiKey === undefined) {
		return <p>Missing API Key in tab followeer</p>;
	}

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

	const createNewPage = async () => {
		const page_name = prompt(
			"Enter page name: ",
			currentTab?.title?.replace(".", "") || "",
		);
		if (!page_name) return;
		createNote({
			apiKey,
			obsidianURL,
			filename: page_name,
			url: currentURL,
			path: undefined,
		})
			.then((_) => window.location.reload())
			.catch((err) =>
				console.error("Encountered error when creating new file"),
			);
		console.log(`Creating a page for ${currentURL}...`);
	};

	// The split(/(?<=\/)/) will split after slashes and leave them intact!
	return (
		<div>
			<span className="text-gray-500 text-xs">{currentURL}</span>
			<br />
			<span className="text-gray-500 text-xs">{currentTab?.title}</span>
			<div className="flex flex-row justify-between p-3">
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
				<div>
					<button
						type="button"
						onClick={createNewPage}
						className="cursor-pointer bg-green-300 border-1 rounded-md p-1"
					>
						Create New Page
					</button>
				</div>
			</div>
		</div>
	);
}
