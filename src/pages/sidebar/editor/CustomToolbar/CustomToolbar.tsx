import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, type TextFormatType } from "lexical";

export default function CustomTextActions() {
	const [editor] = useLexicalComposerContext();

	const handleOnClick = (formatType: TextFormatType) => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
	};

	return (
		<select
			name="formats"
			id="formats"
			value="placeholder"
			className="w-20 text-center h-8 bg-transparent hover:bg-blue-400 text-blue-300 font-semibold hover:text-white border border-blue-300 hover:border-transparent rounded px-2 py-1 m-1"
		>
			<option disabled selected className="hidden" value="placeholder">
				Format
			</option>
			{[
				"Bold",
				"Italic",
				"Underline",
				"Code",
				"Highlight",
				"Strikethrough",
				"Subscript",
				"Superscript",
			].map((tag) => {
				return (
					<option
						value={tag}
						key={tag}
						onClick={(e) => {
							handleOnClick(tag.toLowerCase() as TextFormatType);
							e.preventDefault();
						}}
					>
						{tag}
					</option>
				);
			})}
		</select>
	);
}
