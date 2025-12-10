import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import {
	type InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useMemo } from "react";
import CustomHeadingActions from "./CustomHeadingActions/CustomHeadingActions";
import CustomHeadingPlugin from "./CustomHeadingPlugin/CustomHeadingPlugin";
import CustomHistoryActions from "./CustomHistoryActions";
import CustomTextActions from "./CustomToolbar/CustomToolbar";
import { FrontmatterNode } from "./Frontmatter/FrontmatterNode";
import FrontmatterPlugin from "./Frontmatter/FrontmatterPlugin";
import { ImageNode } from "./Images/ImageNode";
import ImagesPlugin from "./Images/ImagesPlugin";
import OnChangePlugin from "./OnChangePlugin/OnChangePlugin";
import { SmartlinkNode } from "./Smartlink/SmartlinkNode";
import SmartlinkPlugin from "./Smartlink/SmartlinkPlugin";
import { TextInserterPlugin } from "./TextInserterPlugin/TextInserterPlugin";
import "./Theme.css";
import { EDITOR_TRANSFORMERS } from "./Transformers";

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

			ImageNode,

			SmartlinkNode,
			FrontmatterNode,
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
			quote: "text-quote",
			list: {
				nested: {
					listitem: "nestedListItem",
				},
				olDepth: ["ol1", "ol2", "ol3", "ol4", "ol5"],
				ul: "ul",
				listitem: "listItem",
				listitemChecked: "listItemChecked",
				listitemUnchecked: "listItemUnchecked",
			},
			//list: {
			//	nested: {
			//		listitem: "ml-4 list-none", // Indent nested list items by 1rem
			//	},
			//	// ol: "list-decimal pl-8", // Use decimal numbers for ordered lists and add left padding of 2rem
			//	ol: ["ol1"]
			//	ul: "list-disc pl-8", // Use disc bullets for unordered lists and add left padding of 2rem
			//	listitem: "mb-2", // Add bottom margin of 0.5rem to list items
			//	// listitemChecked: "line-through text-gray-500 bg-red-600", // Style checked list items with line-through and gray text
			//	listitemChecked: "listItemChecked",
			//	// listitemUnchecked: "bg-red-600", // Unchecked list items don't require additional styling
			//	listitemUnchecked: "listItemUnchecked",
			//},
		},
		editorState: () => $convertFromMarkdownString(data, EDITOR_TRANSFORMERS),
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
				<TextInserterPlugin />
				<CustomHeadingPlugin />
				<TabIndentationPlugin />
				<ImagesPlugin />
				<ListPlugin />
				<SmartlinkPlugin />
				<FrontmatterPlugin />
				<CheckListPlugin />
				<MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
				<div style={{ margin: "20px 0px" }}>
					<CustomHistoryActions />
					<CustomTextActions />
					<CustomHeadingActions />
				</div>
			</LexicalComposer>
		</div>
	);
}
