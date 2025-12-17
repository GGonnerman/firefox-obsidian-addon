import { $createLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import {
	type saveContentMessage,
	saveContentMessageSchema,
} from "@src/pages/Schemas";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { useCallback, useEffect } from "react";
import Browser from "webextension-polyfill";
import { $createImageNode } from "../Images/ImageNode";

export const TextInserterPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const appendContent = useCallback(
		(message: saveContentMessage) => {
			editor.update(() => {
				const root = $getRoot();
				if (message.type === "text") {
					const quoteNode = $createQuoteNode();
					const baseURL = message.url;
					const encodedText = encodeURI(message.data);
					const linkedURL = `${baseURL}#:~:text=${encodedText}`;
					const linkNode = $createLinkNode(linkedURL);
					const textNode = $createTextNode(message.data);
					linkNode.append(textNode);
					quoteNode.append(linkNode);
					root.append(quoteNode);
				} else {
					// Must be image
					const paragraphNode = $createParagraphNode();
					const imageNode = $createImageNode({
						src: message.data,
						altText: "Image",
					});
					paragraphNode.append(imageNode);
					root.append(paragraphNode);
				}
			});
		},
		[editor],
	);

	useEffect(() => {
		Browser.runtime.onMessage.addListener(async (newMsg: any) => {
			const saveContentMessageResult =
				saveContentMessageSchema.safeParse(newMsg);
			if (!saveContentMessageResult.success) {
				console.debug(`Failed to decode save content message`, newMsg);
				return;
			}

			const [tab] = await Browser.tabs.query({
				currentWindow: true,
				active: true,
			});

			const saveContentMessage = saveContentMessageResult.data;

			if (saveContentMessage.id !== tab.id) return;

			appendContent(saveContentMessage);
		});
	}, [appendContent]);

	return null;
};
