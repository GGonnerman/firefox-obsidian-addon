export async function getNote({ apiKey, obsidianURL, path }: { apiKey: string, obsidianURL: string, path: string }): Promise<string> {
    if (!path.includes(".")) {
        throw new Error("Attempted to get note from a directory, expected a file");
    }

    const baseURL = `${obsidianURL}/vault`;
    const fullPath = `${baseURL}/${path}`;
    const bearer = `Bearer ${apiKey}`;

    const response = await fetch(fullPath, {
        headers: {
            accept: "text/markdown",
            Authorization: bearer,
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.text();
}

export async function writeNote({ apiKey, obsidianURL, path, data }: { apiKey: string, obsidianURL: string, path: string, data: string | undefined }) {
    if (data === undefined) {
        throw new Error("Cannot write note with undefined content");
    }
    const baseURL = `${obsidianURL}/vault`;
    const fullPath = `${baseURL}/${path}`;
    const bearer = `Bearer ${apiKey}`;
    const response = await fetch(fullPath, {
        method: "PUT",
        headers: {
            "Content-Type": "text/markdown",
            Authorization: bearer,
        },
        body: data,
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    console.log("Write not to a place with some content!")
    return data;
}