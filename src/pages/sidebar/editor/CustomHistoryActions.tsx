import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";

export default function CustomHistoryActions() {
	const [editor] = useLexicalComposerContext();
	return (
		<>
			<button
				type="button"
				onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
			>
				Undo
			</button>
			<button
				type="button"
				onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
			>
				Redo
			</button>
		</>
	);
}
