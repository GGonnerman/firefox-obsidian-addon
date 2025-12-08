/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import Browser from "webextension-polyfill";
import { saveContentMessage, saveContentMessageSchema } from "../Schemas";
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

	const appendContent = (message: saveContentMessage) => {
		if (message.type === "text") {
			setLocalState((current: string) => `${current}\n\n> ${message.data}`);
		} else {
			// Must be image
			setLocalState(
				(current: string) => `${current}\n\n> ![Image](${message.data})`,
			);
		}
		console.log("Reloading page...");
		window.location.reload();
	};

	useEffect(() => {
		Browser.runtime.onMessage.addListener(async (newMsg: any) => {
			const saveContentMessageResult =
				saveContentMessageSchema.safeParse(newMsg);
			if (!saveContentMessageResult.success) {
				console.debug(`Failed to decode save content message`, newMsg);
				return;
			}

			const [tab] = await Browser.tabs.query({
				currentWindow: true,
				active: true,
			});

			const saveContentMessage = saveContentMessageResult.data;

			if (saveContentMessage.url !== tab.url) return;

			appendContent(saveContentMessage);
		});
	}, []);

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
		<div className="w-full h-full">
			{path}
			<br />
			{localState}
			<br />
			{localState && <NoteEditor data={localState} setData={setLocalState} />}
		</div>
	);
}
