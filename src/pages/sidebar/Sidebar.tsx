import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { SixDotsScale } from "react-svg-spinners";
import { aboutVault } from "./api/vault";
import { ConfigContext } from "./contexts/ConfigContextProvider";
import Credentials from "./Credentials";
import Navigator from "./Navigator";
import Note from "./Note";
import TabFollower from "./TabFollower";

export default function Sidebar() {
	// The parts of a path are called segments!
	// Source: https://www.rfc-editor.org/rfc/rfc2396#section-3.3
	const [pathSegments, setPathSegments] = useState<string[]>([]);
	const path = pathSegments.join("");
	const [isFollowing, setIsFollowing] = useState(true);

	const { apiKey, obsidianURL } = useContext(ConfigContext);

	const { isPending, isError, data, error } = useQuery({
		enabled: apiKey !== undefined,
		queryKey: [apiKey, obsidianURL],
		queryFn: () => aboutVault({ apiKey, obsidianURL }),
	});

	const pushPathSegment = (newPart: string) => {
		setIsFollowing(false);
		setPathSegments((curr) => [...curr, newPart]);
	};

	const popPathSegment = () => {
		setIsFollowing(false);
		if (pathSegments.length === 0) return;
		setPathSegments((curr) => [...curr.slice(0, -1)]);
	};

	if (!apiKey || apiKey === "" || !obsidianURL || obsidianURL === "") {
		return <Credentials />;
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
		<div className="bg-gray-800 w-full h-full flex flex-col text-white">
			<TabFollower
				setRealPath={setPathSegments}
				realPath={pathSegments}
				isFollowing={isFollowing}
				setIsFollowing={setIsFollowing}
			/>
			<div className="w-full min-h-0 grow flex flex-col">
				<Navigator
					path={path}
					pushPath={pushPathSegment}
					popPath={popPathSegment}
				/>
				{path.includes(".") && <Note key={path} path={path} />}
			</div>
		</div>
	);
}
