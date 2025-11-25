// Source - https://stackoverflow.com/a
// Posted by Chen Peleg, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-24, License - CC BY-SA 4.0

// debounceHook.ts
import React from 'react';

export const useDebounce = (
    callback: (...args: any[]) => void,
    delay: number,
) => {
    const callbackRef = React.useRef(callback);

    React.useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    let timer: NodeJS.Timeout;

    const naiveDebounce = (
        func: (...args: any[]) => void,
        delayMs: number,
        ...args: any[]
    ) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delayMs);
    };

    return React.useMemo(() => (...args: any) => naiveDebounce(
        callbackRef.current,
        delay,
        ...args,
    ), [delay]);
};
