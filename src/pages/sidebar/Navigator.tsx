import Vault from "./Vault";

/** biome-ignore-all lint/a11y/useAltText: <explanation> */
export default function Navigator({
	path,
	pushPath,
	popPath,
}: {
	path: string;
	pushPath: (path: string) => void;
	popPath: () => void;
}) {
	return (
		<div>
			<ul>
				{path.length > 0 && (
					<li className="cursor-pointer" onMouseDown={() => popPath()}>
						..
					</li>
				)}
				{!path.includes(".") && (
					<Vault key={path} path={path} pushPath={pushPath} popPath={popPath} />
				)}
			</ul>
		</div>
	);
}
