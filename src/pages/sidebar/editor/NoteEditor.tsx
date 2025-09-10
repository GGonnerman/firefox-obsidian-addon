import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useMemo } from "react";
import CustomHistoryActions from "./CustomHistoryActions";
import CustomTextActions from "./CustomTextActions/CustomTextActions";
import initialState from "./initialState.json";
import OnChangePlugin from "./OnChangePlugin/OnChangePlugin";
import "./Theme.css";

export default function NoteEditor() {
	const CustomContent = useMemo(() => {
		return (
			<ContentEditable
				style={{
					position: "relative",
					borderColor: "rgba(255,211,2,0.68)",
					border: "2px solid red",
					borderRadius: "5px",
					maxWidth: "100%",
					padding: "10px",
				}}
			/>
		);
	}, []);

	const lexicalConfig: InitialConfigType = {
		namespace: "My Rich Text Editor",
		onError: (e) => {
			console.log("ERROR:", e);
		},
		theme: {
			text: {
				bold: "text-bold",
				italic: "text-italic",
				underline: "text-underline",
				code: "text-code",
				highlight: "text-highlight",
				strikethrough: "text-strikethrough",
				subscript: "text-subscript",
				superscript: "text-superscript",
			},
		},
		editorState: JSON.stringify(initialState),
	};

	return (
		<div style={{ padding: "20px" }}>
			<LexicalComposer initialConfig={lexicalConfig}>
				<RichTextPlugin
					contentEditable={CustomContent}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<OnChangePlugin />
				<div style={{ margin: "20px 0px" }}>
					<CustomHistoryActions />
					<CustomTextActions />
				</div>
			</LexicalComposer>
		</div>
	);
}
