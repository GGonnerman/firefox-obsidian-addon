import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import { TextNode } from "lexical";
import { JSX, useCallback, useEffect } from "react";
import { $createKeywordNode, KeywordNode } from "./Keyword";

const KEYWORDS_REGEX =
	/(^|[^A-Za-z])(congrats|congratulations|mazel tov|mazal tov)($|[^A-Za-z])/i;

export function KeywordsPlugin(): JSX.Element | null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([KeywordNode])) {
			throw new Error("KeywordsPlugin: KeywordNode not registered on editor");
		}
	}, [editor]);

	const $convertToKeywordNode = useCallback(
		(textNode: TextNode): KeywordNode => {
			return $createKeywordNode(textNode.getTextContent());
		},
		[],
	);

	const getKeywordMatch = useCallback((text: string) => {
		const matchArr = KEYWORDS_REGEX.exec(text);

		if (matchArr === null) {
			return null;
		}

		const hashtagLength = matchArr[2].length;
		const startOffset = matchArr.index + matchArr[1].length;
		const endOffset = startOffset + hashtagLength;
		return {
			end: endOffset,
			start: startOffset,
		};
	}, []);

	useLexicalTextEntity<KeywordNode>(
		getKeywordMatch,
		KeywordNode,
		$convertToKeywordNode,
	);

	return null;
}
