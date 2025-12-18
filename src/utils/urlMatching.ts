import type { UUID } from "crypto";

// Ordered in terms of specificity
export enum MatchingSchema {
    Host = 0,
    Path,
    Exact,
}

export const defaultSchema = MatchingSchema.Path;

// export type MatchingRules = Record<string, MatchingSchema>;

export type UrlSchema = {
    url: string;
    schema: MatchingSchema;
    id: UUID;
};

export function getMatchingSchemas(url: URL, matchingRules: UrlSchema[]): MatchingSchema[] {
    const schemas: MatchingSchema[] = [];
    // The schemas get less specific, so the "most-specific" rules are checked first
    for (const section of [
        url.href,
        `${url.origin}${url.pathname}${url.search}`,
        `${url.origin}${url.pathname}`,
        url.origin,
        url.host,
        url.hostname
    ]) {
        for (const rule of matchingRules) {
            if (rule.url === section && !schemas.includes(rule.schema)) {
                schemas.push(rule.schema);
            }
        }
    }
    return schemas;
}

export type RegexSchema = {
    regex: string;
    schema: MatchingSchema;
}

export function generateMatchingRegexes(url: URL, schemas: MatchingSchema[]): RegexSchema[] {
    return schemas.map(schema => ({
        schema: schema,
        regex: generateMatchingRegex(url, schema)
    }))
}

export function generateMatchingRegex(url: URL, schema: MatchingSchema): string {

    switch (schema) {
        case MatchingSchema.Host: {
            let hostMatch: string;
            if (url.protocol === "about:") {
                hostMatch = `${url.protocol}.*`;
            } else {
                hostMatch = `(https?://)?${url.origin}.*`;
            }
            return hostMatch;
        }
        case MatchingSchema.Exact: {
            return url.href;
        }
        default: {
            let pathMatch: string;
            if (url.protocol === "about:") {
                pathMatch = `${url.protocol}${url.pathname}.*`;
            } else {
                pathMatch = `${url.origin}${url.pathname}.*`;
            }
            return pathMatch;
        }
    }
}