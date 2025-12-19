/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { hashCode } from "@src/utils/crypto";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import { MessageSchema } from "../Schemas";
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
	const [mostRecentHash, setMostRecentHash] = useState<number>();
	const [internalChangeTime, setInternalChangeTime] = useState<number>(0);
	const [externalChangeTime, setExternalChangeTime] = useState<number>(0);

	const reloadPage = () => {
		const localHash = hashCode(localState);
		console.debug(`My Local has is ${localHash} compared with most recent of ${mostRecentHash}`, { localstate: localState})
		if(mostRecentHash && mostRecentHash !== hashCode(localState) && externalChangeTime > internalChangeTime) {
			window.location.reload();
		}
	}

	useEffect(() => {
		Browser.runtime.onMessage.addListener(async (newMsg: any) => {
			const messageResult =
				MessageSchema.safeParse(newMsg);
			if (!messageResult.success) {
				console.debug(`Failed to decode message`, newMsg);
				return;
			}

			if(messageResult.data.kind !== "stale") return;

			const staleMessage = messageResult.data;

			if(path === staleMessage.path) {
				setMostRecentHash(staleMessage.hash);
				setExternalChangeTime(staleMessage.timestamp);
			}
		});
	}, [setMostRecentHash]);

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
		<div className="min-h-0 w-full grow" onFocus={reloadPage}>
			<h3 className="text-center text-2xl">{path}</h3>
			{localState && <NoteEditor path={path} data={localState} setData={setLocalState} setChangeTime={setInternalChangeTime} />}
		</div>
	);
}
