/**
 * USAGE:
 * 1. Add KeywordNode to your initialConfig nodes Array.
 *    If you forget this, you will get an error.
 * 2. Add the <KeywordPlugin /> as a child of your LexicalComposer.
 *    If you forget this, it will silently not work.
 * 3. Add CSS somewhere for '.keyword'.
 *    If you don't like that selector, too bad.
 */

import type { EditorConfig, LexicalNode } from 'lexical';
import { $create, TextNode } from 'lexical';

export class KeywordNode extends TextNode {
    $config() {
        return this.config('keyword', { extends: TextNode });
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = 'keyword';
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

export function $createKeywordNode(keyword: string): KeywordNode {
    return $create(KeywordNode).setTextContent(keyword);
}

export function $isKeywordNode(node: LexicalNode | null | undefined): boolean {
    return node instanceof KeywordNode;
}