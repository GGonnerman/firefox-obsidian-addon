import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { SixDotsScale } from "react-svg-spinners";
import { aboutVault } from "./api/vault";
import { ConfigContext } from "./contexts/ConfigContextProvider";
import Navigator from "./Navigator";
import Note from "./Note";
import TabFollower from "./TabFollower";

export default function Sidebar() {
	const [rawPath, setPathParts] = useState<string[]>([]);
	const [path, setPath] = useState("");

	const { apiKey, obsidianURL, setApiKey, setObsidianURL } =
		useContext(ConfigContext);

	const { isPending, isError, data, error } = useQuery({
		enabled: apiKey !== undefined,
		queryKey: [apiKey, obsidianURL],
		queryFn: () => aboutVault({ apiKey, obsidianURL }),
	});

	const pushPath = (newPart: string) => {
		setPathParts((curr) => [...curr, newPart]);
	};

	useEffect(() => {
		setPath(rawPath.join(""));
	}, [rawPath]);

	const handleUpdateRawPath = (pathParts: string[]) => {
		if (
			pathParts.length === rawPath.length &&
			pathParts.every((el, i) => {
				return el === rawPath[i];
			})
		) {
			return;
		}
		setPathParts(pathParts);
	};

	const popPath = () => {
		if (rawPath.length === 0) return;
		setPathParts((curr) => [...curr.slice(0, -1)]);
	};

	const apiElement = useRef<HTMLInputElement>(null);
	const obsidianElement = useRef<HTMLInputElement>(null);

	if (!apiKey || apiKey === "" || !obsidianURL || obsidianURL === "") {
		return (
			<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
				<div className="flex flex-col gap-2">
					<label htmlFor="obsidian-url" className="text-gray-300">
						Obsidian URL:
					</label>
					<input
						id="obsidian-url"
						placeholder="<enter obsidian url>"
						className="text-gray-300 bg-gray-700 m-2 p-2 rounded-sm"
						defaultValue={obsidianURL}
						ref={obsidianElement}
					/>
					<label htmlFor="api-key" className="text-gray-300">
						Api Key:
					</label>
					<input
						id="api-key"
						placeholder="<enter api key>"
						className="text-gray-300 bg-gray-700 m-2 p-2 rounded-sm"
						defaultValue={apiKey}
						ref={apiElement}
					/>
					<p className="text-gray-300 mb-2">
						As a pre-requisite to using this extension, please install my fork
						of the{" "}
						<a
							href="https://github.com/GGonnerman/obsidian-local-rest-api"
							className="text-purple-400 underline"
						>
							Obsidian Local Rest API
						</a>
						. Then,, inside of Obsidian go to Settings -&gt; Community Plugins
						-&gt; Local REST API and retrieve the url and api key. Note:
						currently http is required and obsidian must be running in the
						background while using the extension.
					</p>
					<button
						className="cursor-pointer bg-green-300 border-2 rounded-md p-2"
						type="submit"
						onClick={() => {
							// TODO: Ping the vault to ensure credentials are right before accepting them
							setApiKey(apiElement?.current?.value || "");
							setObsidianURL(obsidianElement?.current?.value || "");
						}}
					>
						Submit
					</button>
					<p className="text-gray-300">
						These values can be changed anytime in the extension popup.
					</p>
				</div>
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 flex flex-col justify-center items-center">
				<p className="text-gray-300 text-2xl">
					<SixDotsScale
						width="25vmin"
						height="25vmin"
						color="oklch(87.2% 0.01 258.338)"
					/>
				</p>
			</div>
		);
	}

	console.debug(`Data Status: ${data}`);

	if (isError) {
		console.error(`Unable to access database. Error: ${error}`);
		return (
			<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800 flex flex-col justify-center items-center">
				<p className="text-gray-300 text-2xl">
					Unable to connect to database. Check credentials in the extension and
					ensure Obsidian is running
				</p>
			</div>
		);
	}

	return (
		<>
			<TabFollower updatePath={handleUpdateRawPath} />
			<div className="w-full h-full">
				<Navigator path={path} pushPath={pushPath} popPath={popPath} />
				{path.includes(".") && <Note key={path} path={path} />}
			</div>
		</>
	);
}
