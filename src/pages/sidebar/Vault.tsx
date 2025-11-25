import { useQuery } from "@tanstack/react-query";
import { getPathFiles } from "./api/vault";

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
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["vaultPath", apiKey, obsidianURL, path],
		queryFn: () => getPathFiles({ apiKey, obsidianURL, path }),
	});

	if (isPending) {
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

	return (
		<>
			{data.map((v) => (
				<li className="cursor-pointer" key={v} onMouseDown={() => pushPath(v)}>
					{v}
				</li>
			))}
		</>
	);
}
