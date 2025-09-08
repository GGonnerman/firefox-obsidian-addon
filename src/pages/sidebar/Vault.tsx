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
	// TODO [SCRUM-19] Either prefetch paths or cache vault paths and then revalidate on click
	const fetchVaultPath = async () => {
		if (!apiKey || apiKey === "") {
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
		queryKey: ["vaultPath"],
		queryFn: fetchVaultPath,
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return (
			<div>
				<span>Error in Vault Navigator</span>
				<p>Error: ${error.message}</p>
			</div>
		);
	}

	// Confirm this is the correct typing
	const files: string[] = data.files;

	return (
		<>
			{files?.map((v) => {
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
		</>
	);
}
