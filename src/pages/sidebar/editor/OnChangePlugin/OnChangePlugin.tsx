import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function OnChangePlugin() {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				console.log("MD DATA", $convertToMarkdownString(TRANSFORMERS));
				console.log("JSON DATA", editor.toJSON());
			});
		});
	}, [editor]);

	return null;
}
