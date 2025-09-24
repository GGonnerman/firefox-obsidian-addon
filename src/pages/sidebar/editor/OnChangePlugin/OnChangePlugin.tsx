import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function OnChangePlugin({
	update,
}: {
	update: (data: string) => void;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				update($convertToMarkdownString(TRANSFORMERS));
				console.log("MD DATA", $convertToMarkdownString(TRANSFORMERS));
				console.log("JSON DATA", editor.toJSON());
			});
		});
	}, [editor, update]);

	return null;
}
