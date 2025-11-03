import { TextMatchTransformer } from "@lexical/markdown";
import { LexicalNode } from "lexical";
import { $createSmartlinkNode, $isSmartlinkNode, SmartlinkNode } from "./SmartlinkNode";

export const SMARTLINK: TextMatchTransformer = {
    dependencies: [SmartlinkNode],
    export: (node: LexicalNode) => {
        if (!$isSmartlinkNode(node)) {
            return null;
        }
        return `${node.getContent()}`;
    },
    importRegExp: /\[\[(.*?)\]\]/,
    regExp: /\[\[(.*?)\]\]/,
    replace: (textNode, match) => {
        const [, content] = match;
        const smartlinkNode = $createSmartlinkNode(`[[${content}]]`);
        textNode.replace(smartlinkNode)
    },
    trigger: "]",
    type: "text-match",
}
