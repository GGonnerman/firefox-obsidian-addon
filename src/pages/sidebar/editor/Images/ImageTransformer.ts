import { TextMatchTransformer } from "@lexical/markdown";
import { $createImageNode, $isImageNode } from "./ImageNode";

// Source - https://stackoverflow.com/a
// Posted by Gerard Rovira
// Retrieved 2025-12-08, License - CC BY-SA 4.0

export const IMAGE_TRANSFORMER: TextMatchTransformer = {
    export: (node, exportChildren, exportFormat) => {
        if (!$isImageNode(node)) {
            return null;
        }

        return `![${node.getAltText()}](${node.getSrc()})\n`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match;
        const imageNode = $createImageNode({ src, altText, width: 800 });
        textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match',
    dependencies: []
};
