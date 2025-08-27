/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { useQuery } from "@tanstack/react-query";

export default function Vault({
	apiKey,
	obsidianURL,
	path,
	pushPath,
	popPath,
}: {
	apiKey: string;
	obsidianURL: string;
	path: string;
	pushPath: (path: string) => void;
	popPath: () => void;
}) {
	const fetchVaultFiles = async () => {
		if (!apiKey) {
			throw new Error("Missing API Key");
		}
		const baseURL = `${obsidianURL}/vault/${path}`;
		const bearer = `Bearer ${apiKey}`;
		const response = await fetch(baseURL, {
			headers: {
				accept: "application/json",
				Authorization: bearer,
			},
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
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

	//const mdFiles = data.files.filter((v) => v.endsWith(".md"));
	const mdFiles = data.files;

	return (
		<div>
			<ul>
				{mdFiles.map((v) => {
					return (
						<li
							className="cursor-pointer"
							key={v}
							onMouseDown={() => pushPath(v)}
						>
							{v}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
