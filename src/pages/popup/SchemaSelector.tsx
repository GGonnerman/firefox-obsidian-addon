import useStickyState from "@src/hooks/useStickyState";
import {
	defaultSchema,
	type MatchingSchema,
	type UrlSchema,
} from "@src/utils/urlMatching";
import type { UUID } from "crypto";
import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { SCHEMA_KEY } from "../constants";

export default function SchemaSelector() {
	const [urls, setUrls] = useStickyState<UrlSchema[]>([], SCHEMA_KEY);

	const removeUrl = (id: UUID) => {
		setUrls((curr) => curr.filter((x) => x.id !== id));
	};

	const addUrl = (url: string) => {
		setUrls((curr) => [
			...curr,
			{ url: url, schema: defaultSchema, id: crypto.randomUUID() },
		]);
	};

	const updateSchema = (id: UUID, newSchema: MatchingSchema) => {
		setUrls((curr) =>
			curr.map((x) => {
				if (x.id === id) {
					return { url: x.url, schema: newSchema, id: x.id };
				}
				return x;
			}),
		);
	};

	const updateUrl = (id: UUID, newUrl: string) => {
		setUrls((curr) =>
			curr.map((x) => {
				if (x.id === id) {
					return { url: newUrl, schema: x.schema, id: x.id };
				}
				return x;
			}),
		);
	};

	return (
		<>
			<h2 className="text-white p-2">Schemas:</h2>
			<div className="grid grid-cols-[auto_80px_40px] gap-y-2">
				{urls.map(({ url, schema, id }) => (
					<React.Fragment key={id}>
						<div className="p-0 m-0">
							<input
								placeholder="<enter url here>"
								className="text-gray-300 border-2 border-gray-600 rounded-md p-0.5 w-full"
								value={url}
								onChange={(e) => updateUrl(id, e.target.value)}
							/>
						</div>
						<div className="p-1">
							<select
								className="text-white"
								value={schema}
								onChange={(e) => updateSchema(id, parseInt(e.target.value, 10))}
							>
								<option value={0}>Host</option>
								<option value={1}>Path</option>
								<option value={2}>Exact</option>
							</select>
						</div>
						<div className="flex flex-row justify-center items-center">
							<FaMinus
								className="cursor-pointer"
								color="white"
								onClick={() => removeUrl(id)}
							/>
						</div>
					</React.Fragment>
				))}
			</div>
			<div>
				<button
					onClick={() => addUrl("")}
					type="button"
					className="cursor-pointer"
				>
					<FaPlus color="white" />
				</button>
			</div>
		</>
	);
}
