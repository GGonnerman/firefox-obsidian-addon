import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingTagType } from "@lexical/rich-text";
import { FORMAT_HEADING_COMMAND } from "../CustomHeadingPlugin/CustomHeadingPlugin";
import { FORMAT_PARAGRAPH_COMMAND } from "../CustomParagraphPlugin/CustomParagraphPlugin";

export default function CustomHeadingActions() {
	const [editor] = useLexicalComposerContext();

	const handleOnClickHeader = (tag: HeadingTagType | string) => {
		editor.dispatchCommand(FORMAT_HEADING_COMMAND, tag);
	};

	const handleOnClickParagraph = () => {
		console.warn(`Handling paragraph click`);
		editor.dispatchCommand(FORMAT_PARAGRAPH_COMMAND, null);
	};

	// Inspired by
	// https://github.com/facebook/lexical/blob/89a093ffd00c0d1a1b2b7bcc66960005c6752b74/packages/lexical-playground/src/context/ToolbarContext.tsx#L32
	const blockToName = {
		h1: "Heading 1",
		h2: "Heading 2",
		h3: "Heading 3",
		h4: "Heading 4",
		h5: "Heading 5",
		normal: "Normal",
	};

	return (
		<select
			name="headers"
			id="headers"
			value="placeholder"
			className="text-center h-8 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded px-2 py-1 m-1"
		>
			<option disabled selected className="hidden" value="placeholder">
				Header
			</option>
			{(["h1", "h2", "h3", "h4", "h5"] as Array<HeadingTagType>).map((tag) => {
				return (
					<option
						value={tag}
						key={tag}
						onClick={(e) => {
							handleOnClickHeader(tag);
							e.preventDefault();
						}}
					>
						{blockToName[tag as keyof typeof blockToName]}
					</option>
				);
			})}
			<option
				value={"normal"}
				key={"normal"}
				onClick={(e) => {
					handleOnClickParagraph();
					e.preventDefault();
				}}
			>
				Normal
			</option>
		</select>
	);
}
