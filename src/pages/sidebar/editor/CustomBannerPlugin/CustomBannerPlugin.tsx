import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_NORMAL,
	createCommand,
} from "lexical";
import { BannerNode } from "../BannerNode/BannerNode";

export const $createBannerNode = (): BannerNode => new BannerNode();

export const INSERT_BANNER_COMMAND = createCommand("create_banner");

export default function CustomBannerPlugin() {
	const [editor] = useLexicalComposerContext();

	if (!editor.hasNode(BannerNode)) {
		throw new Error('BannerPlugin: "BannerNode" not registered on editor');
	}

	editor.registerCommand(
		INSERT_BANNER_COMMAND,
		() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, $createBannerNode);
			}
			return true;
		},
		COMMAND_PRIORITY_NORMAL,
	);

	return null;
}
