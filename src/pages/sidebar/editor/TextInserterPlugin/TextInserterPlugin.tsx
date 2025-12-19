import { $createLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import {
	MessageSchema,
	type saveContentMessage
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
			const messageResult =
				MessageSchema.safeParse(newMsg);
			if (!messageResult.success) {
				console.debug(`Failed to decode message`, newMsg);
				return;
			}

			if(messageResult.data.kind !== "saveContent") return;

			const [tab] = await Browser.tabs.query({
				currentWindow: true,
				active: true,
			});

			const saveContentMessage = messageResult.data;

			if (saveContentMessage.id !== tab.id) return;

			appendContent(saveContentMessage);
		});
	}, [appendContent]);

	return null;
};
