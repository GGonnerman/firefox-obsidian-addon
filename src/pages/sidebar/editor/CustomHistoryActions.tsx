import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { GrRedo, GrUndo } from "react-icons/gr";

export default function CustomHistoryActions() {
	const [editor] = useLexicalComposerContext();
	return (
		<div>
			<button
				type="button"
				title="Undo"
				onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
				className="h-8 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded px-2 py-1 m-1"
			>
				<GrUndo />
			</button>
			<button
				type="button"
				title="Redo"
				onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
				className="h-8 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded px-2 py-1 m-1"
			>
				<GrRedo />
			</button>
		</div>
	);
}
