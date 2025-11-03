import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useMemo } from "react";
import CustomHeadingActions from "./CustomHeadingActions/CustomHeadingActions";
import CustomHeadingPlugin from "./CustomHeadingPlugin/CustomHeadingPlugin";
import CustomHistoryActions from "./CustomHistoryActions";
import CustomTextActions from "./CustomToolbar/CustomToolbar";
import OnChangePlugin from "./OnChangePlugin/OnChangePlugin";
import { SmartlinkNode } from "./Smartlink/SmartlinkNode";
import SmartlinkPlugin from "./Smartlink/SmartlinkPlugin";
import { SMARTLINK } from "./Smartlink/SmartlinkTransformer";
import "./Theme.css";

export default function NoteEditor({
	data,
	setData,
}: {
	data: string;
	setData: (data: string) => void;
}) {
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
		nodes: [
			HeadingNode,

			HorizontalRuleNode,
			CodeNode,
			LinkNode,
			ListNode,
			ListItemNode,
			HeadingNode,
			QuoteNode,

			SmartlinkNode,
		],
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
			heading: {
				h1: "text-5xl font-extrabold",
				h2: "text-4xl font-bold",
				h3: "text-3xl font-bold",
				h4: "text-2xl font-bold",
				h5: "text-xl font-bold",
			},
		},
		editorState: () =>
			$convertFromMarkdownString(data, [SMARTLINK, ...TRANSFORMERS]),
	};

	return (
		<div style={{ padding: "20px" }}>
			<LexicalComposer initialConfig={lexicalConfig}>
				<RichTextPlugin
					contentEditable={CustomContent}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<OnChangePlugin update={setData} />
				<CustomHeadingPlugin />
				<SmartlinkPlugin />
				<MarkdownShortcutPlugin transformers={[SMARTLINK, ...TRANSFORMERS]} />
				<div style={{ margin: "20px 0px" }}>
					<CustomHistoryActions />
					<CustomTextActions />
					<CustomHeadingActions />
				</div>
			</LexicalComposer>
		</div>
	);
}
