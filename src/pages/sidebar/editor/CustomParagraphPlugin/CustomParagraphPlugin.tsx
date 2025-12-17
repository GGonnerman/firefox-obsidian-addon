import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_NORMAL,
	createCommand,
} from "lexical";
import { useEffect } from "react";

export const FORMAT_PARAGRAPH_COMMAND = createCommand(
	"FORMAT_PARAGRAPH_COMMAND",
);

export default function CustomParagraphPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.registerCommand(
			FORMAT_PARAGRAPH_COMMAND,
			() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createParagraphNode());
				}
				return true;
			},
			COMMAND_PRIORITY_NORMAL,
		);
	}, []);

	return null;
}
