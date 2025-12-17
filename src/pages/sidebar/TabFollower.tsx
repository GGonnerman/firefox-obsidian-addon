import { useQuery } from "@tanstack/react-query";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import Browser, { type Tabs } from "webextension-polyfill";
import { createNote } from "./api/note";
import { searchVault } from "./api/vault";
import { ConfigContext } from "./contexts/ConfigContextProvider";

type ShallowTab = {
	url: string;
	title: string;
};

export default function TabFollower({
	setRealPath,
	realPath,
	isFollowing,
	setIsFollowing,
}: {
	setRealPath: (segments: string[]) => void;
	realPath: string[];
	isFollowing: boolean;
	setIsFollowing: Dispatch<SetStateAction<boolean>>;
}) {
	// TODO: Add different matching schemas (base vs domain vs subdomain vs ...).
	//       Unsure on difficulty
	const { apiKey, obsidianURL } = useContext(ConfigContext);
	const [tab, _setTab] = useState<ShallowTab>();
	const [idealPath, setIdealPath] = useState<string[]>([]);

	const isSynced =
		realPath.length > 0 &&
		realPath.length === idealPath.length &&
		realPath.every((val, i) => val === idealPath[i]);

	// Here is where some hard-coding maps can be placed to better match user
	// expectations/behaviors.
	const setTab = useCallback(
		(newTab: Tabs.Tab) => {
			// newtab and blank should be the 'same' page
			let { url, title } = newTab;
			if (url === undefined || title === undefined) return;
			if (url === "about:blank") {
				url = "about:newtab";
			}
			if (url === tab?.url) {
				return;
			}
			console.log(`Updating url from ${tab?.url || "<unset>"} to ${url}`);
			_setTab({
				title,
				url,
			});
		},
		[tab],
	);

	// Indicates going to a new/different tab
	const updateActiveTab = useCallback(() => {
		Browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
			setTab(tabs[0]);
		});
	}, [setTab]);

	// Set active tabs on initial page load
	useEffect(updateActiveTab, []);

	useEffect(() => {
		Browser.tabs.onActivated.addListener(updateActiveTab);
		Browser.tabs.onUpdated.addListener(updateActiveTab);
		return () => {
			Browser.tabs.onActivated.removeListener(updateActiveTab);
			Browser.tabs.onUpdated.removeListener(updateActiveTab);
		};
	}, [updateActiveTab]);

	// Searches for a note with specific header information
	const url = tab?.url || "";
	const urlRegex = (() => {
		return url;
	})();
	const query = { regexp: [urlRegex, { var: "frontmatter.url" }] };
	const { isPending, isError, data, error } = useQuery({
		enabled: apiKey !== undefined,
		queryKey: [url, apiKey, obsidianURL, query],
		queryFn: () => searchVault({ apiKey, obsidianURL, query }),
	});

	useEffect(() => {
		if (!data || data.length < 1) {
			setIdealPath([]);
			return;
		}
		const newIdealPath = data[0].filename.split(/(?<=\/)/);
		setIdealPath(newIdealPath);
		if (!isFollowing) return;
		setRealPath(newIdealPath);
		console.log(`Path is now, ${data[0].filename}`);
	}, [data, setIdealPath, isFollowing]);

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

	const gotoPage = () => {
		setRealPath(idealPath);
	};

	const createNewPage = async () => {
		const page_name = prompt(
			"Enter page name: ",
			tab?.title.replace(".", "") || "",
		);
		if (!page_name) return;
		createNote({
			apiKey,
			obsidianURL,
			filename: page_name,
			url: url,
			path: undefined,
		})
			.then((_) => window.location.reload())
			.catch((err) =>
				console.error("Encountered error when creating new file", err),
			);
		console.log(`Creating a page for ${url}...`);
	};

	// The split(/(?<=\/)/) will split after slashes and leave them intact!
	return (
		<div>
			<div>I am {(isSynced && "synced") || "freeeeee"}</div>
			<div>
				{idealPath.map((x, i) => (
					<span key={i}>{x}/</span>
				))}
			</div>
			<span className="text-gray-500 text-xs">{url}</span>
			<br />
			<span className="text-gray-500 text-xs">{tab?.title}</span>
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
					{(idealPath.length === 0 && (
						<button
							type="button"
							onClick={createNewPage}
							className="cursor-pointer bg-green-300 border-1 rounded-md p-1"
						>
							Create New Page
						</button>
					)) ||
						(!isSynced && (
							<button
								type="button"
								onClick={gotoPage}
								className="cursor-pointer bg-green-300 border-1 rounded-md p-1"
							>
								Go To Page
							</button>
						))}
				</div>
			</div>
		</div>
	);
}
