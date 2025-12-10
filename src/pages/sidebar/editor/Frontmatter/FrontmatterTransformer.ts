import { TextMatchTransformer } from "@lexical/markdown";
import { LexicalNode } from "lexical";
import { $createFrontmatterNode, $isFrontmatterNode, FrontmatterNode } from "./FrontmatterNode";

export const FRONTMATTER: TextMatchTransformer = {
    dependencies: [FrontmatterNode],
    export: (node: LexicalNode) => {
        if (!$isFrontmatterNode(node)) {
            return null;
        }
        return `${node.getContent()}`;
    },
    importRegExp: /url: (.*)/,
    regExp: /url: (.*)/,
    replace: (textNode, match) => {
        const [, content] = match;
        const frontmatterNode = $createFrontmatterNode(`url: ${content}`);
        textNode.replace(frontmatterNode)
    },
    //trigger: "-",
    type: "text-match",
}
