/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import { type TextNode } from 'lexical';
import type { JSX } from 'react';
import { useCallback, useEffect } from 'react';

import { $createFrontmatterNode, FrontmatterNode } from './FrontmatterNode';

const FRONTMATTER_REGEX =
    /(?:url: (.*))/i;

export default function FrontmatterPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([FrontmatterNode])) {
            throw new Error('FrontmatterPlugin: FrontmatterNode not registered on editor');
        }
    }, [editor]);

    const $createFrontmatterNode_ = useCallback((textNode: TextNode): FrontmatterNode => {
        return $createFrontmatterNode(textNode.getTextContent());
    }, []);

    const getFrontmatterMatch = useCallback((text: string) => {
        const matchArr = FRONTMATTER_REGEX.exec(text);

        if (matchArr === null) {
            return null;
        }

        const frontmatterlength = matchArr[1].length + 5;
        const startoffset = matchArr.index;
        const endoffset = startoffset + frontmatterlength;
        return {
            end: endoffset,
            start: startoffset,
        };
    }, []);

    useLexicalTextEntity<FrontmatterNode>(
        getFrontmatterMatch,
        FrontmatterNode,
        $createFrontmatterNode_,
    );

    return null;
}
