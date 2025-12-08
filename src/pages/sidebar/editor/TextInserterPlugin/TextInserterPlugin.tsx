import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { useEffect } from "react";

const TextInserterPlugin = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.update(() => {
			const selection = $getSelection();
			if (selection) {
				selection.insertText("the text I wanted to insert");
			}
		});
	}, [editor]);

	return null;
};
