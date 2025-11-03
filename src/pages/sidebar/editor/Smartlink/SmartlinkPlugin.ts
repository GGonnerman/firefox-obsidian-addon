/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import type { TextNode } from 'lexical';
import type { JSX } from 'react';
import { useCallback, useEffect } from 'react';

import { $createSmartlinkNode, SmartlinkNode } from './SmartlinkNode';

const SMARTLINK_REGEX =
    /(?:\[\[(.*?)\]\])/i;

export default function SmartlinkPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([SmartlinkNode])) {
            throw new Error('SmartlinkPlugin: SmartlinkNode not registered on editor');
        }
    }, [editor]);

    const $createSmartlinkNode_ = useCallback((textNode: TextNode): SmartlinkNode => {
        return $createSmartlinkNode(textNode.getTextContent());
    }, []);

    const getSmartlinkMatch = useCallback((text: string) => {
        const matchArr = SMARTLINK_REGEX.exec(text);

        if (matchArr === null) {
            return null;
        }

        const smartlinklength = matchArr[1].length + 4;
        const startoffset = matchArr.index;
        const endoffset = startoffset + smartlinklength;
        return {
            end: endoffset,
            start: startoffset,
        };
    }, []);

    useLexicalTextEntity<SmartlinkNode>(
        getSmartlinkMatch,
        SmartlinkNode,
        $createSmartlinkNode_,
    );

    return null;
}
