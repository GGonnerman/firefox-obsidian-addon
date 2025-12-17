// Ordered in terms of specificity
export enum MatchingSchema {
    Host = 0,
    Path,
    Exact,
}

export type MatchingRules = Record<string, MatchingSchema>;

export function getMatchingSchema(url: URL, matchingRules: MatchingRules): MatchingSchema {
    // Path is the default matching rul
    let schema = MatchingSchema.Path;
    // The schemas get more specific, so the "most-specific" rule is chosen allowing for a nice overriding setup
    for (const section of [url.hostname, url.host, url.origin, `${url.origin}${url.pathname}`, `${url.origin}${url.pathname}${url.search}`, url.href]) {
        if (section in matchingRules) {
            schema = matchingRules[section];
        }
    }
    return schema;
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