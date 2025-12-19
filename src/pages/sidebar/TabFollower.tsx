import useStickyState from "@src/hooks/useStickyState";
import {
	generateMatchingRegexes,
	getMatchingSchemas,
	MatchingSchema,
	type UrlSchema,
} from "@src/utils/urlMatching";
import { useQuery } from "@tanstack/react-query";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import Browser, { type Tabs } from "webextension-polyfill";
import { NEW_FILE_LOCATION_KEY, SCHEMA_KEY } from "../constants";
import { createNote } from "./api/note";
import { searchVaultMultiple } from "./api/vault";
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
	const [schemaMap, setSchemaMap] = useStickyState<UrlSchema[]>([], SCHEMA_KEY);
	const [tab, _setTab] = useState<ShallowTab>();
	const [idealPath, setIdealPath] = useState<string[]>([]);
	const [schema, setSchema] = useState<MatchingSchema[]>();
	const [newFilePath, _setNewFilePath] = useStickyState<string>("", NEW_FILE_LOCATION_KEY)

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

	const url = tab?.url || "";
	// Searches for a note with specific header information
	const urlRegexes = useMemo(() => {
		// If the url is not valid, just return it and pretend everything is ok
		if (!URL.canParse(url))
			return [
				{
					schema: MatchingSchema.Exact,
					regex: url,
				},
			];
		const parsedURL = new URL(url);
		// Special parsing rule for built-in "about" pages
		const schemas = getMatchingSchemas(parsedURL, schemaMap);
		console.debug(`Found schemas`, schemas);
		setSchema(schemas);
		const regexes = generateMatchingRegexes(parsedURL, schemas);
		console.debug(`Made regexes`, regexes);
		return regexes;
	}, [url]);
	const { isPending, isError, data, error } = useQuery({
		enabled: apiKey !== undefined,
		queryKey: [url, apiKey, obsidianURL, urlRegexes],
		queryFn: () => searchVaultMultiple({ apiKey, obsidianURL, urlRegexes }),
	});

	useEffect(() => {
		if (!data || data.results.length < 1) {
			setIdealPath([]);
			return;
		}
		const newIdealPath = data.results[0].filename.split(/(?<=\/)/);
		setIdealPath(newIdealPath);
		if (!isFollowing) return;
		setRealPath(newIdealPath);
		console.log(`Path is now, ${data.results[0].filename}`);
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

	const gotoNote = () => {
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
			path: newFilePath,
		})
			.then((_) => window.location.reload())
			.catch((err) =>
				console.error("Encountered error when creating new file", err),
			);
		console.log(`Creating a page for ${url}...`);
	};

	const addPathMatcher = async () => {
		setSchemaMap((curr) => [
			...curr,
			{
				id: crypto.randomUUID(),
				url: url,
				schema: MatchingSchema.Path,
			},
		]);
		console.log(`Adding path match for ${url}...`);
	};

	// The split(/(?<=\/)/) will split after slashes and leave them intact!
	return (
		<div>
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
				<div  className="text-gray-800">
					{(idealPath.length === 0 && (
						<button
							type="button"
							onClick={createNewPage}
							className="cursor-pointer bg-green-300 border-1 rounded-md p-1"
						>
							Create New Page
						</button>
					)) ||
						(isSynced && data.schema === 0 && (
							<button
								type="button"
								onClick={() => {
									createNewPage();
									addPathMatcher();
								}}
								className="cursor-pointer bg-gray-300 border-1 rounded-md p-1"
							>
								Create Specific Page
							</button>
						)) ||
						(!isSynced && (
							<button
								type="button"
								onClick={gotoNote}
								className="cursor-pointer bg-green-300 border-1 rounded-md p-1"
							>
								Go To Note
							</button>
						))}
				</div>
			</div>
		</div>
	);
}
