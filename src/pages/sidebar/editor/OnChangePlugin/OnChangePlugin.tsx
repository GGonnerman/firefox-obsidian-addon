import { $convertToMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { staleMessage } from "@src/pages/Schemas";
import { hashCode } from "@src/utils/crypto";
import { useEffect } from "react";
import Browser from "webextension-polyfill";
import { EDITOR_TRANSFORMERS } from "../Transformers";

export default function OnChangePlugin({
	path,
	update,
	setChangeTime
}: {
	path: string;
	update: (data: string) => void;
	setChangeTime: (time: number) => void;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const markdownString = $convertToMarkdownString(EDITOR_TRANSFORMERS);
				const time = Date.now();
				const hash = hashCode(markdownString);
				const message: staleMessage = {
					"path": path,
					"hash": hash,
					"timestamp": time,
					"kind": "stale",
				}
				console.debug(`Sending the message: `, message)
				Browser.runtime.sendMessage(message);

				setChangeTime(time);
				update(markdownString);
				console.log("MD DATA", $convertToMarkdownString(EDITOR_TRANSFORMERS));
				console.log("JSON DATA", editor.toJSON());
			});
		});
	}, [editor, update, path]);

	return null;
}
