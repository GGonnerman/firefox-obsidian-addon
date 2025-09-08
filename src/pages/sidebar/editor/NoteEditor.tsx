export default function NoteEditor({
	data,
	updateData,
}: {
	data: string;
	updateData: (data: string) => void;
}) {
	return (
		<textarea
			className="w-full h-full"
			onChange={(e) => updateData(e.target.value)}
			value={data}
		/>
	);
}
