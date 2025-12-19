import type {
	EditorConfig,
	LexicalNode,
	NodeKey,
	SerializedTextNode,
	Spread,
} from "lexical";

import { $applyNodeReplacement, TextNode } from "lexical";

export type SerializedSmartlinkNode = Spread<
	{
		__text: string;
		__color: string;
	},
	SerializedTextNode
>;

export class SmartlinkNode extends TextNode {
	__text: string;
	__color: string;

	static getType(): string {
		return "smartlink";
	}

	static clone(node: SmartlinkNode): SmartlinkNode {
		return new SmartlinkNode(node.__text, node.__key);
	}

	static importJSON(serializedNode: SerializedSmartlinkNode): SmartlinkNode {
		return $createSmartlinkNode().updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedSmartlinkNode {
		return {
			...super.exportJSON(),
			__text: this.__text,
			__color: this.__color,
		};
	}

	constructor(text: string, key?: NodeKey) {
		super(text, key);
		this.__text = text;
		this.__color = "oklch(43.8% 0.218 303.724)"
	}

	getContent(): string {
		return this.__text;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);
		dom.style.cursor = "default";
		dom.style.backgroundColor = this.__color;
		dom.className = "smartlink";
		return dom;
	}

	canInsertTextBefore(): boolean {
		return false;
	}

	canInsertTextAfter(): boolean {
		return false;
	}

	isTextEntity(): true {
		return true;
	}
}

export function $createSmartlinkNode(text: string = ""): SmartlinkNode {
	return $applyNodeReplacement(new SmartlinkNode(text));
}

export function $isSmartlinkNode(
	node: LexicalNode | null | undefined,
): node is SmartlinkNode {
	return node instanceof SmartlinkNode;
}
