import { useContext, useRef } from "react";
import { ConfigContext } from "./contexts/ConfigContextProvider";

export default function Credentials() {
	const apiElement = useRef<HTMLInputElement>(null);
	const obsidianElement = useRef<HTMLInputElement>(null);

	const { apiKey, obsidianURL, setApiKey, setObsidianURL } =
		useContext(ConfigContext);

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
			<div className="flex flex-col gap-2">
				<label htmlFor="obsidian-url" className="text-gray-300">
					Obsidian URL:
				</label>
				<input
					id="obsidian-url"
					placeholder="<enter obsidian url>"
					className="text-gray-300 bg-gray-700 m-2 p-2 rounded-sm"
					defaultValue={obsidianURL}
					ref={obsidianElement}
				/>
				<label htmlFor="api-key" className="text-gray-300">
					Api Key:
				</label>
				<input
					id="api-key"
					placeholder="<enter api key>"
					className="text-gray-300 bg-gray-700 m-2 p-2 rounded-sm"
					defaultValue={apiKey}
					ref={apiElement}
				/>
				<p className="text-gray-300 mb-2">
					As a pre-requisite to using this extension, please install my fork of
					the{" "}
					<a
						href="https://github.com/GGonnerman/obsidian-local-rest-api"
						className="text-purple-400 underline"
					>
						Obsidian Local Rest API
					</a>
					. Then,, inside of Obsidian go to Settings -&gt; Community Plugins
					-&gt; Local REST API and retrieve the url and api key. Note: currently
					http is required and obsidian must be running in the background while
					using the extension.
				</p>
				<button
					className="cursor-pointer bg-green-300 border-2 rounded-md p-2"
					type="submit"
					onClick={() => {
						setApiKey(apiElement?.current?.value || "");
						setObsidianURL(obsidianElement?.current?.value || "");
					}}
				>
					Submit
				</button>
				<p className="text-gray-300">
					These values can be changed anytime in the extension popup.
				</p>
			</div>
		</div>
	);
}
