/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { getNote, writeNote } from "./api/note";
import { ConfigContext } from "./contexts/ConfigContextProvider";
import NoteEditor from "./editor/NoteEditor";

export default function Note({ path }: { path: string }) {
	const { apiKey, obsidianURL } = useContext(ConfigContext);
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["vaultFiles", apiKey, obsidianURL, path],
		queryFn: () => getNote({ apiKey, obsidianURL, path }),
		gcTime: 0,
	});

	const [localState, setLocalState] = useState("");

	useEffect(() => {
		if (!isPending && !isError) {
			setLocalState(data);
		}
	}, [isPending, isError, data]);

	useEffect(() => {
		if (localState !== undefined && localState !== "") {
			writeNote({ apiKey, obsidianURL, path, data: localState }).catch(
				(reason) =>
					console.warn(`Error in handling update data`, localState, reason),
			);
		}
	}, [localState, apiKey, path, obsidianURL]);

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error: ${error.message}</p>;
	}

	if (typeof data === "undefined") {
		return <p>Data is undefined</p>;
	}

	return (
		<div className="min-h-0 w-full grow">
			<h3 className="text-center text-2xl">{path}</h3>
			{localState && <NoteEditor data={localState} setData={setLocalState} />}
		</div>
	);
}
