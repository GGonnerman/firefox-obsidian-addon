import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_BANNER_COMMAND } from "../CustomBannerPlugin/CustomBannerPlugin";

export default function CustomBannerActions() {
	const [editor] = useLexicalComposerContext();

	const handleOnClick = () => {
		editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined);
	};

	return (
		<div style={{ marginTop: "10px" }}>
			<span style={{ fontWeight: "bold" }}>Heading actions</span>
			<div>
				<button type="button" onClick={handleOnClick}>
					Banner
				</button>
			</div>
		</div>
	);
}
