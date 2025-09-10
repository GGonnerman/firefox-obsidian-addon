import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, TextFormatType } from "lexical";

export default function CustomTextActions() {
	const [editor] = useLexicalComposerContext();

	const handleOnClick = (formatType: TextFormatType) => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
	};

	return (
		<div style={{ marginTop: "10px" }}>
			<span style={{ fontWeight: "bold" }}>Text actions</span>
			<div>
				{[
					"Bold",
					"Italic",
					"Underline",
					"Code",
					"Highlight",
					"Strikethrough",
					"Subscript",
					"Superscript",
				].map((value) => {
					return (
						<button
							type="button"
							key={value}
							onClick={() =>
								handleOnClick(value.toLowerCase() as TextFormatType)
							}
							className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded px-2 py-1 m-1"
						>
							{value}
						</button>
					);
				})}
			</div>
		</div>
	);
}
