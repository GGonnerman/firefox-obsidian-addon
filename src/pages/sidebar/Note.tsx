/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
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

	const handleUpdateData = (data: string) => {
		writeNote({ apiKey, obsidianURL, path, data }).catch((reason) =>
			console.warn(`Error in handling update data`, data, reason),
		);
	};

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
		<div className="w-full h-full">
			{path}
			<br />
			<NoteEditor data={data} setData={handleUpdateData} />
		</div>
	);
}
