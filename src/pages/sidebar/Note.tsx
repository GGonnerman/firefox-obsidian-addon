/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { useQuery } from "@tanstack/react-query";

export default function Note({
	apiKey,
	path,
}: {
	apiKey: string;
	path: string;
}) {
	const fetchVaultFiles = async () => {
		if (!apiKey) {
			throw new Error("Missing API Key");
		}
		const baseURL = "http://127.0.0.1:27123/vault";
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

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error: ${error.message}</p>;
	}

	console.debug("Current State of Data", data);

	return (
		<div>
			{path}
			<p>{data}</p>
		</div>
	);
}
