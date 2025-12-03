import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getPathFiles } from "./api/vault";
import { ConfigContext } from "./contexts/ConfigContextProvider";

export default function Vault({
	path,
	pushPath,
	popPath,
}: {
	path: string;
	pushPath: (path: string) => void;
	popPath: () => void;
}) {
	const { apiKey, obsidianURL } = useContext(ConfigContext);
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
