/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { getNote, writeNote } from "./api/note";
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
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["vaultFiles", apiKey, obsidianURL, path],
		queryFn: () => getNote({ apiKey, obsidianURL, path }),
		gcTime: 0,
	});

	//const [content, setContent] = useState("");

	//useEffect(() => {
	//	setContent(data || "");
	//}, [data]);

	//const handleUpdateData = useDebounce((data: string) => {
	const handleUpdateData = (data: string) => {
		//setContent(data);
		writeNote({ apiKey, obsidianURL, path, data }).catch((reason) =>
			console.warn(`Error in handling update data`, data, reason),
		);
	};

	//const queryClient = useQueryClient();
	//const {
	//	status: mutStatus,
	//	error: mutError,
	//	mutate,
	//} = useMutation({
	//	mutationFn: ({ path, data }: { path: string; data: string | undefined }) =>
	//		writeNote({ apiKey, obsidianURL, path, data }),
	//	onSuccess: (data) => {
	//		queryClient.setQueryData(["vaultFiles", apiKey, obsidianURL, path], data);
	//	},
	//});

	//const x = (data: string) => {
	//	writeNote({ apiKey, obsidianURL, path, data }).catch((reason) =>
	//		console.warn(`Error in handling update data`, data, reason),
	//	);
	//};

	if (isPending) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error: ${error.message}</p>;
	}

	if (typeof data === "undefined") {
		return <p>Data is undefined</p>;
	}

	return (
		<div className="w-full h-full">
			{path}
			<br />
			<NoteEditor data={data} setData={handleUpdateData} key={"key"} />
		</div>
	);
}
