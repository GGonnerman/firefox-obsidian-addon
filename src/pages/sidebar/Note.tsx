/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import NoteEditor from "./editor/NoteEditor";

export default function Note({
	apiKey,
	obsidianURL,
	path,
}: {
	apiKey: string;
	obsidianURL: string;
	path: string;
}) {
	const fetchVaultFiles = async () => {
		if (!apiKey) {
			throw new Error("Missing API Key");
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
	};

	const { isLoading, isError, data, error } = useQuery({
		queryKey: ["vaultFiles"],
		queryFn: fetchVaultFiles,
	});

	const mutationFn = async (data: string) => {
		if (!apiKey) {
			throw new Error("Missing API Key");
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
		return response.json();
	};

	const [content, setContent] = useState("");

	useEffect(() => {
		setContent(data || "");
	}, [data]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error: ${error.message}</p>;
	}

	if (typeof data === "undefined") {
		return <p>Data is undefined</p>;
	}

	const handleUpdateData = (data: string) => {
		setContent(data);
		mutationFn(data);
	};

	console.debug("Current State of Data", data);

	return (
		<div className="w-full h-full">
			{path}
			<br />
			<NoteEditor data={data} key={"key"} />
		</div>
	);
}
