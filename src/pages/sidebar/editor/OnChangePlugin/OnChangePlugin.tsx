import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { SMARTLINK } from "../Smartlink/SmartlinkTransformer";

export default function OnChangePlugin({
	update,
}: {
	update: (data: string) => void;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				update($convertToMarkdownString([SMARTLINK, ...TRANSFORMERS]));
				console.log(
					"MD DATA",
					$convertToMarkdownString([SMARTLINK, ...TRANSFORMERS]),
				);
				console.log("JSON DATA", editor.toJSON());
			});
		});
	}, [editor, update]);

	return null;
}
