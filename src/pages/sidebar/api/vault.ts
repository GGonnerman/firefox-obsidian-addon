import z from 'zod';

const fileListSchema = z.object({
    files: z.array(z.string())
});

export async function getPathFiles({ apiKey, obsidianURL, path }: { apiKey: string, obsidianURL: string, path: string }): Promise<string[]> {
    if (path.includes(".")) {
        throw new Error("Attempted to get files from a file, expected a directory");
    }

    const baseURL = `${obsidianURL}/vault`;
    const fullPath = `${baseURL}/${path}`;
    const bearer = `Bearer ${apiKey}`;

    const response = await fetch(fullPath, {
        headers: {
            accept: "application/json",
            Authorization: bearer,
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const json = await response.json()
    const fileList = fileListSchema.safeParse(json);

    if (!fileList.success) {
        console.debug(`JSON: ${JSON.stringify(json)}`)
        throw new Error("Received malformed response from file listing");
    }

    return fileList.data.files;
}

const searchResultSchema = z.array(
    z.object({
        filename: z.string(),
        result: z.string(),
    })
)

export async function searchVault({ apiKey, obsidianURL, query }: { apiKey: string, obsidianURL: string, query: object }) {
    const baseURL = `${obsidianURL}/search/`;
    const bearer = `Bearer ${apiKey}`;

    const response = await fetch(baseURL, {
        headers: {
            "content-type": "application/vnd.olrapi.jsonlogic+json",
            Authorization: bearer,
        },
        method: "POST",
        body: JSON.stringify(query),
    });

    if (!response.ok) {
        throw new Error(
            `Network response was not ok: ${JSON.stringify(response)}`,
        );
    }

    const json = await response.json()
    const searchResults = searchResultSchema.safeParse(json);

    if (!searchResults.success) {
        throw new Error("Received malformed response from search");
    }

    return searchResults.data;
}