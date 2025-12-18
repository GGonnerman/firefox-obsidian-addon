import type {
	EditorConfig,
	LexicalNode,
	NodeKey,
	SerializedTextNode,
	Spread,
} from "lexical";

import { $applyNodeReplacement, TextNode } from "lexical";

export type SerializedFrontmatterNode = Spread<
	{
		__text: string;
		__color: string;
	},
	SerializedTextNode
>;

export class FrontmatterNode extends TextNode {
	__text: string;
	__color: string;

	static getType(): string {
		return "frontmatter";
	}

	static clone(node: FrontmatterNode): FrontmatterNode {
		return new FrontmatterNode(node.__text, node.__key);
	}

	static importJSON(
		serializedNode: SerializedFrontmatterNode,
	): FrontmatterNode {
		return $createFrontmatterNode().updateFromJSON(serializedNode);
	}

	exportJSON(): SerializedFrontmatterNode {
		return {
			...super.exportJSON(),
			__text: this.__text,
			__color: this.__color,
		};
	}

	constructor(text: string, key?: NodeKey) {
		super(text, key);
		this.__text = text;
		const color_scheme = [
			"oklch(37.3% 0.034 259.733)",
		];
		this.__color =
			color_scheme[Math.floor(Math.random() * color_scheme.length)];
	}

	getContent(): string {
		return this.__text;
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);
		dom.style.cursor = "default";
		dom.style.backgroundColor = this.__color;
		dom.className = "frontmatter";
		return dom;
	}

	canInsertTextBefore(): boolean {
		return false;
	}

	canInsertTextAfter(): boolean {
		return true;
	}

	isTextEntity(): true {
		return true;
	}
}

export function $createFrontmatterNode(text: string = ""): FrontmatterNode {
	return $applyNodeReplacement(new FrontmatterNode(text));
}

export function $isFrontmatterNode(
	node: LexicalNode | null | undefined,
): node is FrontmatterNode {
	return node instanceof FrontmatterNode;
}
