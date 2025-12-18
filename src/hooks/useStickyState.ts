// useStickyState.tsx
// Source: https://adueck.github.io/blog/persisting-state-in-react-with-typescript-and-use-reducer/

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type SaveableData = string | number | object | boolean | undefined | null;

export default function useStickyState<T extends SaveableData>(defaultValue: T, key: string): [
    value: T,
    setValue: Dispatch<SetStateAction<T>>,
] {
    const [value, setValue] = useState(() => {
        const v = localStorage.getItem(key);
        if (v === null) {
            return defaultValue;
        }
        try {
            return JSON.parse(v);
        } catch (e) {
            console.error("error parsing saved state from useStickyState");
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}