import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_NORMAL, createCommand } from "lexical";

export const DO_SOMETHING_AWESOE = createCommand("create_banner");

export default function CustomComponent() {
	const [editor] = useLexicalComposerContext();
	editor.registerCommand(
		DO_SOMETHING_AWESOE,
		() => {
			console.log("This is my own command");
			return true;
		},
		COMMAND_PRIORITY_NORMAL,
	);

	return null;
}
