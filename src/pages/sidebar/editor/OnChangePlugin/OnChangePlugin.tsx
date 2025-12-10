import { $convertToMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { EDITOR_TRANSFORMERS } from "../Transformers";

export default function OnChangePlugin({
	update,
}: {
	update: (data: string) => void;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				update($convertToMarkdownString(EDITOR_TRANSFORMERS));
				console.log("MD DATA", $convertToMarkdownString(EDITOR_TRANSFORMERS));
				console.log("JSON DATA", editor.toJSON());
			});
		});
	}, [editor, update]);

	return null;
}
